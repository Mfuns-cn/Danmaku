import { DanmakuStyle } from "../Style/DanmakuStyle";
import { AnimationInterface } from "../Animation/Base/AnimationInterface";

/**
 * 单个弹幕接口
 */
export interface DanmakuItemInterface{
    /**
     * 弹幕类型
     */
    getType():string
    /**
     * 弹幕内容
     */
    getContent():string
    /**
     * 弹幕子元素
     */
    getChild():DanmakuItemInterface[]
    /**
     * 弹幕动画
     */
    getAnimation():AnimationInterface
    /**
     * 弹幕样式
     */
    getStyle():DanmakuStyle
    /**
     * 设置弹幕参数
     * @param param 
     */
    setParams(param:{[idx: string]:any}):boolean

    /**
     * 弹幕开始时间
     */
    startTime():number
}