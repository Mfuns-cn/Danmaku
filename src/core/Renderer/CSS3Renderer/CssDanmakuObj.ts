import { UnitTools } from "../../../util/UnitTools";
import { AnimationInterface } from "../../Animation/Base/AnimationInterface";
import { DanmakuItemInterface } from "../../Danmaku/DanmakuItemInterface";
import { DanmakuStyle } from "../../Style/DanmakuStyle";

export interface DanmakuObj {
  element: HTMLElement;
  style: DanmakuStyle;
  animation: AnimationInterface;
  child: DanmakuObj[];
  start: number;
}
export class DanmakuTool {
  /**
   * 递归构建弹幕对象
   * @param danmaku
   * @returns
   */
  public static recursionDanmaku(
    danmaku: DanmakuItemInterface[]
  ): DanmakuObj[] {
    let danmakuobj: DanmakuObj[] = [];
    danmaku.forEach((danmaku) => {
      let div = this.createDiv(danmaku.getContent());
      this.setStyle(div, danmaku.getStyle());
      let obj: DanmakuObj = {
        element: div,
        animation: danmaku.getAnimation(),
        style: danmaku.getStyle(),
        child: [],
        start: danmaku.startTime(),
      };
      let child = danmaku.getChild();
      let childObj;
      if (child) {
        childObj = this.recursionDanmaku(child);
      }

      obj.child = childObj;
      danmakuobj.push(obj);
    });
    return danmakuobj;
  }
  /**
   * 创建一个空div
   * @param content
   * @returns
   */
  public static createDiv(content: string): HTMLElement {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.innerText = content;
    return div;
  }

  /**
   * 递归构建element
   * @param danmakuobj
   * @returns
   */
  public static recursionDiv(danmakuobj: DanmakuObj[]): HTMLElement[] {
    let array: HTMLElement[] = [];
    danmakuobj.forEach((item) => {
      let element = item.element;
      if (item.child) {
        let eles = this.recursionDiv(item.child);
        eles.forEach((ele) => {
          element.appendChild(ele);
        });
      }
      array.push(element);
    });
    return array;
  }
  /**
   * 将样式设置到元素中
   */
  public static setStyle(element: HTMLElement, style: { [idx: string]: any }) {
    Object.assign(element.style, style);
  }
  /**
   * 递归设置弹幕动画
   * @param danmaku
   */
  public static recursionStyle(
    danmaku: DanmakuObj[],
    canvas: HTMLElement,
    abstime: number,
    parentTime: number = 0
  ) {
    //console.log(danmaku);
    danmaku.forEach((dan, key) => {
      // 更新弹幕样式
      let time =
        parentTime === 0 ? abstime - dan.start : parentTime - dan.start;

      // console.log(dan.animation);

      let sty;
      let max;
      sty = dan.animation.getStyle(time);
      if (sty) {
        this.setStyle(dan.element, sty);
      }
      max = dan.animation.getMatrix(time);
      if (max) {
        dan.element.style.transform = UnitTools.Matrix3dString(max);
      }
      //console.log(dan);
      // 如果都不存在，则表示动画已经完成，销毁元素
      // 如果是子元素的情况，有可能存在弹幕未开始的情况
      if (!(sty || max)) {
        //console.log(dan);
        if (dan.element.parentElement) {
          // 从父元素删除节点
          dan.element.parentElement.removeChild(dan.element);
        } else {
          // 否则从canvas里面删除
          canvas.removeChild(dan.element);
        }
        // 并且清空节点
        delete danmaku[key];
      }
      // 递归
      this.recursionStyle(dan.child, canvas, abstime, time);
    });
  }
}
