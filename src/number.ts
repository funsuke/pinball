export type NumberAlign = "left" | "center" | "right";

export interface NumberParameterObject extends g.EParameterObject {
	scene: g.Scene;
	assetId: string;
	maxDigit: number;
	align?: NumberAlign;
	pitch?: number;
	zero?: boolean;
}

export class Number extends g.E {
	// 画像アセット
	private imgNumber: g.ImageAsset;
	// エンティティ
	private fSprite: g.FrameSprite[];
	// 1文字の大きさ
	private w: number;
	private h: number;
	// 最大桁数
	private maxDigit: number;
	// ピッチ数
	private pitch: number;
	// 0表示
	private zero: boolean;
	// 位置整列
	private align: string;
	// 表示数字
	private showNum: number;
	private nextNum: number;
	// チェンジフレーム
	private changeFrame: number;
	// チェンジフレームカウンタ
	private changeFrameCnt: number;
	// コンストラクタ
	constructor(param: NumberParameterObject) {
		super(param);
		this.scene = param.scene;
		this.imgNumber = this.scene.asset.getImageById(param.assetId);
		this.w = this.imgNumber.width / 10;
		this.h = this.imgNumber.height;
		this.maxDigit = param.maxDigit;
		this.pitch = this.w;
		this.zero = false;
		this.showNum = 0;
		this.nextNum = 0;
		this.changeFrame = g.game.fps;
		this.changeFrameCnt = this.changeFrame;
		if (param.pitch) {
			this.pitch = param.pitch;
		}
		if (param.zero) {
			this.zero = param.zero;
		}
		if (param.align !== "center" && param.align !== "right") {
			this.align = "left";
		} else {
			this.align = param.align;
		}
		this.fSprite = new Array<g.FrameSprite>(this.maxDigit);
		//
		this.createEntity();
	};
	//
	get nowScore(): number {
		return (this.showNum > this.nextNum) ? this.showNum : this.nextNum;
	}
	//
	public setNumber(n: number): void {
		this.showNum = n;
		let useNum: number = n;
		let digit: number = 0;
		// calc digit (Math.log10)
		if (!this.zero) {
			if (n > 0) {
				digit = Math.floor(Math.log(n) * Math.LOG10E);
			}
		} else {
			digit = this.maxDigit;
		}
		for (let i = 0; i < this.maxDigit; i++) {
			if (this.align === "left") {
				this.fSprite[i].x = this.pitch * (digit - 1 - i);
			} else if (this.align === "center") {
				this.fSprite[i].x = this.pitch * (digit - 1 - i) + this.pitch / 2;
			}
			this.fSprite[i].frameNumber = useNum % 10;
			this.fSprite[i].modified();
			if (i === 0 || useNum !== 0) {
				this.fSprite[i].show();
			} else {
				if (!this.zero) {
					this.fSprite[i].hide();
				} else {
					this.fSprite[i].show();
				}
			}
			useNum = Math.floor(useNum / 10);
		}
		this.width = this.pitch * digit + this.w;
		this.modified();
	};
	/**
	 *
	 * @param n 整数
	 */
	public setNext(n: number): void {
		this.nextNum = n;
		this.changeFrameCnt = this.changeFrame;
	}
	/**
	 * onUpdateなどに置く
	 * @returns
	 */
	public change(): void {
		const diff: number = this.nextNum - this.showNum;
		if (diff <= 0) return;
		const add: number = Math.max(Math.floor(diff / this.changeFrameCnt), 1);
		this.changeFrameCnt--;
		this.setNumber(this.showNum + add);
	}
	//
	private createEntity(): void {
		for (let i = 0; i < this.maxDigit; i++) {
			this.fSprite[i] = new g.FrameSprite({
				scene: this.scene,
				src: this.imgNumber,
				width: this.w,
				height: this.h,
				anchorX: this.anchorX,
				anchorY: this.anchorY,
				srcWidth: this.w,
				srcHeight: this.h,
				frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				x: this.pitch * (this.maxDigit - 1 - i),
				y: 0,
			});
			this.append(this.fSprite[i]);
		}
		this.width = this.pitch * (this.maxDigit - 1) + this.w;
		this.modified();
	};
}
