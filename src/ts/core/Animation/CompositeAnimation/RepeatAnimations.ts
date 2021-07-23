import { AnimationFactory } from "src/ts/Factory/AnimationFactory";
import { DanmakuStyle } from "../../Style/DanmakuStyle";
import { AnimationInterface } from "../Base/AnimationInterface";
import { CubicAnimations } from "../Base/CubicAnimations";
import { StaticAnimation } from "../TransformsAnimations/StaticAnimation";

export class RepeatAnimations extends CubicAnimations{
    /**
     * 动画接口
     */
    public animation:AnimationInterface
    /**
     * 重复次数
     */
    public repeat:number = 1
    /**
     * 单个动画时间
     */
    public animationTime:number
    public getCubicStyle(_progress: number, time: number): false | DanmakuStyle {
        return this.animation.getStyle(this.getCurTime(time))
    }
    public getMatrixForCubic(_progress: number, time: number): false | number[] {
        return this.animation.getMatrix(this.getCurTime(time))
    }
    public setParams(param: { [idx: string]: any; }): boolean {
        super.setParams(param);

        if(param?.animation){
            this.animation =  AnimationFactory.getAnimations(param?.animation.type,param?.animation.params) || new StaticAnimation()

        }else{
            this.animation = new StaticAnimation()
        }

        console.log(this.animation);

        this.repeat = param?.repeat || this.repeat
        this.animationTime = this.animation.getDuration()
        // 覆盖父级存活时间 
        // 计算方式 单个弹幕时间 X 弹幕重复次数
        this.duration = this.animationTime * this.repeat
        console.log(this.duration);

        return true
    }
    /**
     * 获得当前的弹幕时间
     */
    public getCurTime(time:number){
        // 取余
        return time % this.animationTime
    }
}