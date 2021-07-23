import { DanmakuStyle } from "../../Style/DanmakuStyle";
import { CubicAnimations } from "../Base/CubicAnimations";

export class TranslateAnimation extends CubicAnimations {

    public path: { x1: number, y1: number, z1: number, x2: number, y2: number, z2: number }
        =
        { x1: 0, y1: 0, x2: 0, y2: 0, z1: 0, z2: 0 }
    public setParams(param: { [idx: string]: any; }): boolean {
        if (!super.setParams(param)) { return false; }
        this.path = Object.assign(this.path,param?.path)
        return true
    }
    public getCubicStyle(): false | DanmakuStyle {
        return false;
    }
    public getMatrixForCubic(progress: number): false | number[] {
        // console.log(this.path);
        // console.log(progress);

        let x = this.getProgressValue(this.path.x1, this.path.x2, progress);
        let y = this.getProgressValue(this.path.y1, this.path.y2, progress)
        let z = this.getProgressValue(this.path.z1, this.path.z2, progress)

        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]
    }
}