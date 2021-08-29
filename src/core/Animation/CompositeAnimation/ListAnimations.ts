import { AnimationFactory } from "../../../Factory/AnimationFactory";
import { DanmakuStyle } from "../../Style/DanmakuStyle";
import { AnimationInterface } from "../Base/AnimationInterface";
import { CubicAnimations } from "../Base/CubicAnimations";
import { Matrix } from "../Base/Matrix";
/**
 * 动画列表组，所有动画按顺序播放
 */
export class ListAnimations extends CubicAnimations {
  public animations: AnimationInterface[] = [];
  /**
   * 每个动画结束的累计矩阵
   */
  public cumulativeMatrix: number[][] = [];
  public cumulativeTime: number[] = [];
  public duration: number = 0;
  public setParams(param: { [idx: string]: any }): boolean {
    super.setParams(param);
    this.animations = AnimationFactory.getAnimationsList(
      param?.animations || []
    );

    let duration = 0;
    this.cumulativeMatrix[0] = Matrix.getNullMatrix();
    this.cumulativeTime[0] = duration;

    this.animations.forEach((val, key) => {
      let dur = val.getDuration();

      // 自增1，因为0的结束帧的1的开头
      key++;
      // 计算出每个动画结束后的矩阵叠加,传入持续时间以获得最后一帧动画
      let matrix = val.getMatrix(dur) || Matrix.getNullMatrix();
      // 叠加
      this.cumulativeMatrix[key] = Matrix.mult(
        matrix,
        this.cumulativeMatrix[key - 1]
      );

      duration += dur;
      this.cumulativeTime[key] = duration;
    });

    if (this.duration < duration) {
      this.duration = duration;
    }

    return true;
  }

  public getCubicStyle(_progress: number, time: number): false | DanmakuStyle {
    let curAnimation = this.getCurAnimation(time);

    if (curAnimation) {
      return curAnimation.animation.getStyle(time);
    }
    return false;
  }

  public getMatrixForCubic(_progress: number, time: number): false | number[] {
    let curAnimation = this.getCurAnimation(time);

    if (curAnimation) {
      time = time - this.cumulativeTime[curAnimation.key];

      let mat =
        curAnimation.animation.getMatrix(time) || Matrix.getNullMatrix();
      return Matrix.mult(mat, this.cumulativeMatrix[curAnimation.key]);
    }
    return false;
  }
  /**
   * 获取当前的动画元素,如果不存在则返回false
   */
  protected getCurAnimation(
    time: number
  ): { key: number; animation: AnimationInterface } | false {
    for (let i = this.animations.length - 1; i >= 0; i--) {
      let duration = this.cumulativeTime[i];
      if (time > duration) {
        return { key: i, animation: this.animations[i] };
      }
    }
    return false;
  }
}
