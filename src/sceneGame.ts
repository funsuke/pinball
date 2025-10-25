import * as b2 from "@akashic-extension/akashic-box2d";
import tl = require("@akashic-extension/akashic-timeline");
import { AkashicB2Body } from "./akashicB2Body";
import { B2BodyData } from "./b2BodyData";

// GBの解像度 160 x 144
// height を 720 にする(5倍に拡大して表示する)
// → 800 x 720
const GB = {
	width: 800,
	height: 720,
};

const PADDING_X: number = (g.game.width - GB.width) / 2;
const FLIPPER_TORQUE: number = 800;
const FLIPPER_SPEED: number = 13.0;

declare const window: any;

const DEBUG_DRINK_REMOVE: boolean = false;

// *************************************************
// ゲームシーン
// *************************************************
export class SceneGame extends g.Scene {
	private box2d: b2.Box2D;
	private flipperLJoint: b2.Box2DWeb.Dynamics.Joints.b2RevoluteJoint;
	private flipperRJoint: b2.Box2DWeb.Dynamics.Joints.b2RevoluteJoint;
	private ballId: string;
	private buttonLEntity: g.Sprite;
	private buttonREntity: g.Sprite;
	private b2DrinkL: b2.EBody;
	private b2DrinkR: b2.EBody;
	private pushEBodyList: b2.EBody[] = [];
	private removeEBodyList: b2.EBody[] = [];
	private isExistDrinkL: boolean = true;
	private isExistDrinkR: boolean = true;
	private drinkL: g.FrameSprite;
	private drinkR: g.FrameSprite;
	private b2Ball: b2.EBody;
	private b2Namako: b2.EBody;
	private isExistNamako: boolean = true;
	private isPlayAudioFlipperL: boolean = true;
	private isPlayAudioFlipperR: boolean = true;
	//
	constructor(param: g.GameMainParameterObject) {
		super({ game: g.game });
		// 読込時処理
		this.onLoad.add(() => {
			this._Load(param);
		});
		// 更新時処理
		this.onUpdate.add(() => {
			this.box2d.step(1 / g.game.fps);
			// 削除リスト処理
			this.removeEBodyList.forEach((b2body) => {
				this.box2d.removeBody(b2body);
			});
			this.removeEBodyList = [];
			// 追加リスト処理
			// this.pushEBodyList.forEach((b2body) => {
			// 	this.box2d.bodies.push(b2body);
			// });
			// this.pushEBodyList = [];
		});
		// -------------------------------------------------------------
		// フリッパー用イベント
		// -------------------------------------------------------------
		this.onPointDownCapture.add((ev: g.PointDownEvent) => {
			if (ev.point.x < g.game.width / 2) {
				this.buttonLEntity.angle = 180;
				this.buttonLEntity.modified();
				this.moveFlipperL(-FLIPPER_SPEED);
			} else {
				this.buttonREntity.angle = 180;
				this.buttonREntity.modified();
				this.moveFlipperR(+FLIPPER_SPEED);
			}
		});
		this.onPointUpCapture.add((ev: g.PointUpEvent) => {
			if (ev.point.x < g.game.width / 2) {
				this.buttonLEntity.angle = 0;
				this.buttonLEntity.modified();
				this.moveFlipperL(+FLIPPER_SPEED);
			} else {
				this.buttonREntity.angle = 0;
				this.buttonREntity.modified();
				this.moveFlipperR(-FLIPPER_SPEED);
			}
		});
		// キー入力イベント
		window.addEventListener("keydown", (ev: any) => {
			switch (ev.keyCode) {
				case 65:	// A
				case 37:	// ←
					this.buttonLEntity.angle = 180;
					this.buttonLEntity.modified();
					this.moveFlipperL(-FLIPPER_SPEED);
					break;
				case 68:	// D
				case 39:	// →
					this.buttonREntity.angle = 180;
					this.buttonREntity.modified();
					this.moveFlipperR(+FLIPPER_SPEED);
					break;
				case 90:	// Z	テスト用
					// 左アウトレーン通過
					this.setBallPosition(320, 400);
					break;
				case 88:	// X	テスト用
					// 左リターンレーン通過
					this.setBallPosition(PADDING_X + 167.5, 400);
					break;
				case 67:	// C テスト用
					// 右リターンレーン通過
					this.setBallPosition(g.game.width - (PADDING_X + 167.5), 400);
					break;
				case 86:	// V テスト用
					// 右アウトレーン通過
					this.setBallPosition(960, 400);
					break;
				case 66:	// B テスト用
					// 左ナマコ激突
					this.setBallPosition(PADDING_X + 250, 300);
					break;
			};
		});
		window.addEventListener("keyup", (ev: any) => {
			// console.log(ev.keyCode);
			switch (ev.keyCode) {
				case 65:	// A
				case 37:	// ←
					this.buttonLEntity.angle = 0;
					this.buttonLEntity.modified();
					this.moveFlipperL(+FLIPPER_SPEED);
					break;
				case 68:	// D
				case 39:	// →
					this.buttonREntity.angle = 0;
					this.buttonREntity.modified();
					this.moveFlipperR(-FLIPPER_SPEED);
					break;
			};
		});
	}
	/**
	 * シーン読込時処理
	 * @param param ゲームパラメータ
	 * @returns
	 */
	private _Load(param: g.GameMainParameterObject): void {
		// BGM再生
		this.asset.getAudioById("8bit-hoshi-carnival").play().changeVolume(0.3);
		// BG
		new g.FilledRect({
			scene: this,
			cssColor: "rgb(165,153,254)",
			width: GB.width, height: GB.height,
			x: PADDING_X, y: 0,
			parent: this,
		});
		// Box2D初期化
		this.box2d = new b2.Box2D({
			gravity: [0, 9.8],
			scale: 50,
			sleep: true,
		});
		// -------------------------------------------------------------
		// 左フリッパー
		// -------------------------------------------------------------
		const flipperL = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("flipperL1"),
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width / 2 - 132, y: 617,
			// angle: 180 + 17 - 52,
			angle: 17,
			parent: this,
		});
		// AkashicB2Body設定
		const b2FlipperL: b2.EBody = new AkashicB2Body(flipperL, this.box2d, B2BodyData.flipperL).getEBody();
		// 左フリッパージョイント設定
		const flipperLJointDef = new b2.Box2DWeb.Dynamics.Joints.b2RevoluteJointDef();
		flipperLJointDef.Initialize(this.box2d.world.GetGroundBody(), b2FlipperL.b2Body, this.box2d.vec2(g.game.width / 2 - 132, 617));
		flipperLJointDef.maxMotorTorque = FLIPPER_TORQUE;
		flipperLJointDef.motorSpeed = 0.0;
		flipperLJointDef.enableMotor = true;
		flipperLJointDef.lowerAngle = -52 * Math.PI / 180;
		flipperLJointDef.upperAngle = 0 * Math.PI / 180;
		flipperLJointDef.enableLimit = true;
		this.flipperLJoint = this.box2d.world.CreateJoint(flipperLJointDef);
		// -------------------------------------------------------------
		// 右フリッパー
		// -------------------------------------------------------------
		const flipperR = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("flipperR1"),
			// anchorX: 98 / 127, anchorY: 29 / 59,
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width / 2 + 132, y: 617,
			angle: -17,
			parent: this,
		});
		// AkashicB2Body設定
		const b2FlipperR: b2.EBody = new AkashicB2Body(flipperR, this.box2d, B2BodyData.flipperR).getEBody();
		// 右フリッパージョイント設定
		const flipperRJointDef = new b2.Box2DWeb.Dynamics.Joints.b2RevoluteJointDef();
		flipperRJointDef.Initialize(this.box2d.world.GetGroundBody(), b2FlipperR.b2Body, this.box2d.vec2(g.game.width / 2 + 132, 617));
		flipperRJointDef.maxMotorTorque = FLIPPER_TORQUE;
		flipperRJointDef.motorSpeed = 0.0;
		flipperRJointDef.enableMotor = true;
		flipperRJointDef.lowerAngle = 0 * Math.PI / 180;
		flipperRJointDef.upperAngle = 52 * Math.PI / 180;
		flipperRJointDef.enableLimit = true;
		this.flipperRJoint = this.box2d.world.CreateJoint(flipperRJointDef);
		// -------------------------------------------------------------
		// ガイド
		// -------------------------------------------------------------
		// 左
		const guideLeft = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("guideL1"),
			x: PADDING_X + 120, y: 440,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(guideLeft, this.box2d, B2BodyData.guideL);
		// 右 C:109,109
		const guideRight = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("guideR1"),
			x: PADDING_X + 535, y: 440,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(guideRight, this.box2d, B2BodyData.guideR);
		// ピン
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("pin"),
			x: PADDING_X + 260, y: 610,
			parent: this,
		});
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("pin"),
			x: PADDING_X + 525, y: 610,
			parent: this,
		});
		// -------------------------------------------------------------
		// 左スリングショット
		// -------------------------------------------------------------
		const slingshotL = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("slingL1"),
			x: PADDING_X + 190, y: 445,
			parent: this,
		});
		// AkashicB2Body設定
		const b2SlingshotL: b2.EBody = new AkashicB2Body(slingshotL, this.box2d, B2BodyData.slingshotL).getEBody();
		// -------------------------------------------------------------
		// 右スリングショット
		// -------------------------------------------------------------
		const slingshotR = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("slingR1"),
			x: PADDING_X + 550, y: 445,
			parent: this,
		});
		// AkashicB2Body設定
		const b2SlingshotR: b2.EBody = new AkashicB2Body(slingshotR, this.box2d, B2BodyData.slingshotR).getEBody();
		// -------------------------------------------------------------
		// 左スイッチ
		// -------------------------------------------------------------
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("switch"),
			x: PADDING_X + 155, y: 480,
			parent: this,
		});
		// -------------------------------------------------------------
		// 左スイッチ
		// -------------------------------------------------------------
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("switch"),
			x: PADDING_X + 620, y: 480,
			parent: this,
		});
		// -------------------------------------------------------------
		// 左壁
		// -------------------------------------------------------------
		const wallL = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("wallL1"),
			x: 240, y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallL, this.box2d, B2BodyData.wallL);
		// -------------------------------------------------------------
		// 右壁
		// -------------------------------------------------------------
		const wallR = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("wallR1"),
			anchorX: 1.0,
			x: g.game.width - 240, y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallR, this.box2d, B2BodyData.wallR);
		// -------------------------------------------------------------
		// 天井
		// -------------------------------------------------------------
		// 天井１
		const wallU1 = new g.E({
			scene: this,
			width: 130, height: 8,
			x: 375, y: 0,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallU1, this.box2d, B2BodyData.wallU1);
		// 天井２
		const wallU2 = new g.E({
			scene: this,
			width: 130, height: 8,
			// cssColor: "black",
			anchorX: 1.0, anchorY: 0.0,
			x: g.game.width - 375, y: 0,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallU2, this.box2d, B2BodyData.wallU2);
		// -------------------------------------------------------------
		// ハッカ油
		// -------------------------------------------------------------
		// 左
		this.drinkL = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("nc282689"),
			width: 50, height: 90,
			frames: [0, 1, 2],
			frameNumber: 1,
			x: PADDING_X + 70, y: 475,
			parent: this,
		});
		this.b2DrinkL = new AkashicB2Body(this.drinkL, this.box2d, B2BodyData.drink).getEBody();
		// 右
		this.drinkR = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("nc282689"),
			width: 50, height: 90,
			frames: [0, 1, 2],
			frameNumber: 1,
			x: PADDING_X + 680, y: 475,
			parent: this,
		});
		this.b2DrinkR = new AkashicB2Body(this.drinkR, this.box2d, B2BodyData.drink).getEBody();
		// -------------------------------------------------------------
		// ニコモバ
		// -------------------------------------------------------------
		const moba: g.FrameSprite[] = new Array<g.FrameSprite>(3);
		// new g.FrameSprite({
		// 	scene: this,
		// 	src: this.asset.getImageById("nc16919"),
		// 	width: 100, height: 100,
		// 	frames: [0, 1],
		// 	interval: 800,
		// 	loop: true,
		// 	anchorX: 0.5, anchorY: 0.5,
		// 	x: 440, y: 100,
		// 	tag: { state: 0, dy: 0.3, idol: 0 },
		// 	parent: this,
		// }).start();
		for (let i = 0; i < moba.length; i++) {
			moba[i] = new g.FrameSprite({
				scene: this,
				src: this.asset.getImageById("nc16919"),
				width: 100, height: 100,
				frames: [0, 1],
				interval: 800,
				loop: true,
				anchorX: 0.5, anchorY: 0.5,
				x: 440 + 200 * i, y: -100,
				tag: { state: 0, dy: 0.3, idleCnt: 0 },
				parent: this,
			});
			moba[i].start();
		}
		const b2Moba: AkashicB2Body[] = new Array<AkashicB2Body>(3);
		for (let i = 0; i < b2Moba.length; i++) {
			// moba[i] = new g.FrameSprite({
			// 	scene: this,
			// 	src: this.asset.getImageById("nc16919"),
			// 	width: 100, height: 100,
			// 	frames: [0, 1],
			// 	interval: 800,
			// 	loop: true,
			// 	anchorX: 0.5, anchorY: 0.5,
			// 	x: 440 + 200 * i, y: 100,
			// 	tag: { state: 0, dy: 0.3, idol: 0 },
			// 	parent: this,
			// });
			// moba[i].start();
			b2Moba[i] = new AkashicB2Body(moba[i], this.box2d, B2BodyData.moba);
			moba[i].onUpdate.add(() => {
				this.moveB2Body(b2Moba[i], moba[i].x, moba[i].y + moba[i].tag.dy);
				if (moba[i].tag.state === 0 && moba[i].y > 250) {
					moba[i].frames = [2, 3];
					moba[i].modified();
					moba[i].interval = 800;
					moba[i].start();
					moba[i].tag.dy = -0.3;
					moba[i].tag.state = 1;
				} else if (moba[i].tag.state === 1 && moba[i].y < -50) {
					moba[i].frames = [0, 1];
					moba[i].modified();
					moba[i].interval = 800;
					moba[i].start();
					moba[i].tag.dy = +0.3;
					moba[i].tag.state = 0;
				} else if (moba[i].tag.state === 2) {
					if (moba[i].tag.idleCnt === 0) {
						moba[i].tag.dy = 0;
						moba[i].interval = 100;
						moba[i].start();
					}
					moba[i].tag.idleCnt++;
					if (moba[i].tag.idleCnt >= 120) {
						moba[i].frames = [2, 3];
						moba[i].modified();
						moba[i].tag = { state: 1, dy: -0.9, idleCnt: 0 };
					}
				}
			});
		}
		// -------------------------------------------------------------
		// ナマコ x:510 ~ 640 ~ 770, y:450
		// -------------------------------------------------------------
		// 影
		const namakoShadow = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("namako_shadow"),
			anchorX: 0.5, anchorY: 1.0,
			x: g.game.width / 2 - 130, y: 450,
			parent: this,
		});
		// 本体
		const namako = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("namako"),
			width: 100, height: 100,
			frames: [0, 1, 2],
			frameNumber: 0,
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width / 2 - 130, y: 400,
			parent: this,
		});
		this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
		// 移動用タイムライン Sx:510
		// new tl.Timeline(this).create(namako, { loop: true })
		// 	.wait(500)
		// 	.call(() => {
		// 		this.removeEBodyList.push(this.b2Namako);
		// 		this.isExistNamako = false;
		// 	})
		// 	.moveX(640 - 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
		// 	.moveX(640 + 0, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)
		// 	.call(() => {
		// 		this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
		// 		this.isExistNamako = true;
		// 	})
		// 	.wait(500)
		// 	.call(() => {
		// 		this.removeEBodyList.push(this.b2Namako);
		// 		this.isExistNamako = false;
		// 	})
		// 	.moveX(640 + 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
		// 	.moveX(640 + 130, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)
		// 	.call(() => {
		// 		this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
		// 		this.isExistNamako = true;
		// 	})
		// 	.wait(500)
		// 	.call(() => {
		// 		this.removeEBodyList.push(this.b2Namako);
		// 		this.isExistNamako = false;
		// 	})
		// 	.moveX(640 + 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
		// 	.moveX(640 + 0, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)
		// 	.call(() => {
		// 		this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
		// 		this.isExistNamako = true;
		// 	})
		// 	.wait(500)
		// 	.call(() => {
		// 		this.removeEBodyList.push(this.b2Namako);
		// 		this.isExistNamako = false;
		// 	})
		// 	.moveX(640 - 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
		// 	.moveX(640 - 130, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)
		// 	.call(() => {
		// 		this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
		// 		this.isExistNamako = true;
		// 	});
		new tl.Timeline(this).create(namako, { loop: true })
			.call(() => {
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).call(() => {
				namako.frameNumber = 0;
				namako.modified();
			}).wait(300).call(() => {
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).every((e, p) => {
				const cnt = Math.floor(e / 125);
				if (cnt % 2 === 0 && namako.frameNumber !== 0) {
					namako.frameNumber = 0;
					namako.modified();
				} else if (cnt % 2 === 1 && namako.frameNumber !== 2) {
					namako.frameNumber = 2;
					namako.modified();
				}
			}, 2000).con().call(() => {
				this.removeEBodyList.push(this.b2Namako);
				this.isExistNamako = false;
				//
				new tl.Timeline(this).create(namako)
					.moveX(640 - 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
					.moveX(640 + 0, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)
			}).call(() => {
				this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
				this.isExistNamako = true;
				//
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).call(() => {
				namako.frameNumber = 0;
				namako.modified();
			}).wait(300).call(() => {
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).every((e, p) => {
				const cnt = Math.floor(e / 125);
				if (cnt % 2 === 0 && namako.frameNumber !== 2) {
					namako.frameNumber = 2;
					namako.modified();
				} else if (cnt % 2 === 1 && namako.frameNumber !== 0) {
					namako.frameNumber = 0;
					namako.modified();
				}
			}, 2000).con().call(() => {
				this.removeEBodyList.push(this.b2Namako);
				this.isExistNamako = false;
				//
				new tl.Timeline(this).create(namako)
					.moveX(640 + 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
					.moveX(640 + 135, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)
			}).call(() => {
				this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
				this.isExistNamako = true;
				//
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).call(() => {
				namako.frameNumber = 0;
				namako.modified();
			}).wait(300).call(() => {
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).every((e, p) => {
				const cnt = Math.floor(e / 125);
				if (cnt % 2 === 0 && namako.frameNumber !== 2) {
					namako.frameNumber = 2;
					namako.modified();
				} else if (cnt % 2 === 1 && namako.frameNumber !== 0) {
					namako.frameNumber = 0;
					namako.modified();
				}
			}, 2000).con().call(() => {
				this.removeEBodyList.push(this.b2Namako);
				this.isExistNamako = false;
				//
				new tl.Timeline(this).create(namako)
					.moveX(640 + 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
					.moveX(640 + 0, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)

			}).call(() => {
				this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
				this.isExistNamako = true;
				//
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).call(() => {
				namako.frameNumber = 0;
				namako.modified();
			}).wait(300).call(() => {
				namako.frameNumber = 1;
				namako.modified();
			}).wait(100).every((e, p) => {
				const cnt = Math.floor(e / 125);
				if (cnt % 2 === 0 && namako.frameNumber !== 2) {
					namako.frameNumber = 2;
					namako.modified();
				} else if (cnt % 2 === 1 && namako.frameNumber !== 0) {
					namako.frameNumber = 0;
					namako.modified();
				}
			}, 2000).con().call(() => {
				this.removeEBodyList.push(this.b2Namako);
				this.isExistNamako = false;
				//
				new tl.Timeline(this).create(namako)
					.moveX(640 - 65, 1000).con().moveY(400 - 50, 1000, tl.Easing.easeOutSine)
					.moveX(640 - 130, 1000).con().moveY(400, 1000, tl.Easing.easeInSine)
			}).call(() => {
				this.b2Namako = new AkashicB2Body(namako, this.box2d, B2BodyData.namako).getEBody();
				this.isExistNamako = true;
				//
				namako.frameNumber = 1;
				namako.modified();
			});

		// 画像用タイムライン
		// new tl.Timeline(this).create(namako, { loop: true })
		// 	.call(() => {
		// 		namako.frameNumber = 1;
		// 		namako.modified();
		// 	}).wait(100).call(() => {
		// 		namako.frameNumber = 0;
		// 		namako.modified();
		// 	}).wait(300).call(() => {
		// 		namako.frameNumber = 1;
		// 		namako.modified();
		// 	}).wait(100).every((e, p) => {
		// 		const cnt = Math.floor(e / 125);
		// 		if (cnt % 2 === 0 && namako.frameNumber !== 2) {
		// 			namako.frameNumber = 2;
		// 			namako.modified();
		// 		} else if (cnt % 2 === 1 && namako.frameNumber !== 0) {
		// 			namako.frameNumber = 0;
		// 			namako.modified();
		// 		}
		// 	}, 2000);
		namako.onUpdate.add(() => {
			// 影
			namakoShadow.x = namako.x;
			namakoShadow.scale(0.5 + (namako.y - 350) / 100);
			namakoShadow.modified();
			// 剛体
			if (!this.isExistNamako) return;
			this._moveB2Body(this.b2Namako, namako.x, namako.y);
		});
		// -------------------------------------------------------------
		// ボール
		// -------------------------------------------------------------
		const ball = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("ball"),
			anchorX: 0.5, anchorY: 0.5,
			// x: 320, y: 400, // ボッシュートテスト
			x: 960, y: 400, // ボッシュートテスト
			// x: 840, y: 400,
			// x: 470, y: 200,
			parent: this,
		});
		// AkashicB2Body設定
		this.b2Ball = new AkashicB2Body(ball, this.box2d, B2BodyData.ball).getEBody();
		// this.ballId = b2Ball.id;
		// ボール位置補正処理
		ball.onUpdate.add(() => {
			this.ballCheckDrink(this.b2Ball);
			this.ballPushUp();
		});
		// -------------------------------------------------------------
		// アツマライオン(アップポスト)
		// -------------------------------------------------------------
		const lion = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("916819"),
			x: (g.game.width - 100) / 2, y: 600,
			parent: this,
		});
		new AkashicB2Body(lion, this.box2d, B2BodyData.lion);
		// -------------------------------------------------------------
		// 天井ブロック
		// -----------------d--------------------------------------------
		// 左
		// const wallUL = new g.FilledRect({
		// 	scene: this,
		// 	cssColor: "red",
		// 	width: 80, height: 80,
		// 	x: PADDING_X + 260, y: 0,
		// 	parent: this,
		// });
		const wallUL = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("wallU"),
			x: PADDING_X + 260, y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallUL, this.box2d, B2BodyData.wallUL);
		// 右
		// const wallUR = new g.FilledRect({
		// 	scene: this,
		// 	cssColor: "blue",
		// 	width: 80, height: 80,
		// 	anchorX: 1.0,
		// 	x: g.game.width - (PADDING_X + 260), y: 0,
		// 	parent: this,
		// });
		const wallUR = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("wallU"),
			x: PADDING_X + 460, y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallUR, this.box2d, B2BodyData.wallUR);
		// -------------------------------------------------------------
		// 屋根
		// -------------------------------------------------------------
		// 左
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("arcade"),
			x: PADDING_X + 140, y: 0,
			parent: this,
		});
		// 中央
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("arcade"),
			x: PADDING_X + 340, y: 0,
			parent: this,
		});
		// 右
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("arcade"),
			x: PADDING_X + 540, y: 0,
			parent: this,
		});
		// -------------------------------------------------------------
		// 左フレーム
		// -------------------------------------------------------------
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("frameL1"),
			parent: this,
		});
		// -------------------------------------------------------------
		// 右フレーム
		// -------------------------------------------------------------
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("frameR1"),
			x: g.game.width - this.asset.getImageById("frameR1").width,
			parent: this,
		});
		// -------------------------------------------------------------
		// 左ボタン
		// -------------------------------------------------------------
		this.buttonLEntity = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("button"),
			anchorX: 0.5, anchorY: 0.5,
			x: 140, y: g.game.height - 40 - 100,
			parent: this,
		});
		// -------------------------------------------------------------
		// 右ボタン
		// -------------------------------------------------------------
		this.buttonREntity = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("button"),
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width - 140, y: g.game.height - 40 - 100,
			parent: this,
		});
		// -------------------------------------------------------------
		// テスト画像
		// -------------------------------------------------------------
		// new g.Sprite({
		// 	scene: this,
		// 	src: this.asset.getImageById("pinball_gb_ss1"),
		// 	x: PADDING_X, y: 0,
		// 	opacity: 0.5,
		// 	parent: this,
		// });
		// -------------------------------------------------------------
		// 衝突検出
		// -------------------------------------------------------------
		const contactListener = new b2.Box2DWeb.Dynamics.b2ContactListener;
		// 衝突開始時処理
		contactListener.BeginContact = ((contact: b2.Box2DWeb) => {
			// ボール→右スリングショットの衝突判定
			if (this.box2d.isContact(this.b2Ball, b2SlingshotR, contact)) {
				const vec2: b2.Box2DWeb.vec2 = contact.GetManifold().m_localPlaneNormal;
				// console.log("x = " + vec2.x + ", y = " + vec2.y);
				// console.log("ボールが右スリングショットが衝突");
				if (vec2.x < 0 && vec2.y < 0) {
					// console.log("右スリングショット発動");
					this.b2Ball.b2Body.ApplyImpulse(this.box2d.vec2(-780, -450), this.b2Ball.b2Body.GetPosition());
					//
					this.asset.getAudioById("nc88229").play();
				}
			}
			// ボール→左スリングショットの衝突判定
			if (this.box2d.isContact(this.b2Ball, b2SlingshotL, contact)) {
				const vec2: b2.Box2DWeb.vec2 = contact.GetManifold().m_localPlaneNormal;
				// console.log("x = " + vec2.x + ", y = " + vec2.y);
				// console.log("ボールが左スリングショットが衝突");
				if (vec2.x > 0 && vec2.y < 0) {
					// console.log("左スリングショット発動");
					this.b2Ball.b2Body.ApplyImpulse(this.box2d.vec2(780, -450), this.b2Ball.b2Body.GetPosition());
					//
					this.asset.getAudioById("nc88229").play();
				}
			}
			// ボール→左ハッカの衝突判定
			if (this.box2d.isContact(this.b2Ball, this.b2DrinkL, contact)) {
				// console.log("ボールが左ハッカと衝突");
				this.b2Ball.b2Body.ApplyImpulse(this.box2d.vec2(0, -700), this.b2Ball.b2Body.GetPosition());
				// ハッカ削除と更新
				this.drinkL.frameNumber = 0;
				this.drinkL.modified();
				//
				this.asset.getAudioById("nc173695").play();
				//
				this.isExistDrinkL = false;
			}
			// ボール→右ハッカの衝突判定
			if (this.box2d.isContact(this.b2Ball, this.b2DrinkR, contact)) {
				// console.log("ボールが右ハッカと衝突");
				this.b2Ball.b2Body.ApplyImpulse(this.box2d.vec2(0, -700), this.b2Ball.b2Body.GetPosition());
				// ハッカ削除と更新
				this.drinkR.frameNumber = 2;
				this.drinkR.modified();
				//
				this.asset.getAudioById("nc173695").play();
				//
				this.isExistDrinkR = false;
			}
			// ボール→ニコモバの衝突判定
			for (let i = 0; i < b2Moba.length; i++) {
				if (this.box2d.isContact(this.b2Ball, b2Moba[i].getEBody(), contact)) {
					b2Moba[i].getEntity().tag.state = 2;
					//
					this.asset.getAudioById("nc294364").play();
				}
			}
			// ボール→ナマコの衝突判定
			if (this.box2d.isContact(this.b2Ball, this.b2Namako, contact)) {
				this.asset.getAudioById("nc373067").play();
			}
		});
		// 衝突終了時処理
		contactListener.EndContact = ((contact: b2.Box2DWeb) => {
			// ボール→左ハッカの衝突判定
			if (this.box2d.isContact(this.b2Ball, this.b2DrinkL, contact)) {
				this.removeEBodyList.push(this.b2DrinkL);
			}
			// ボール→右ハッカの衝突判定
			if (this.box2d.isContact(this.b2Ball, this.b2DrinkR, contact)) {
				this.removeEBodyList.push(this.b2DrinkR);
			}
		});
		this.box2d.world.SetContactListener(contactListener);
		return;
	}
	/**
	 * 左フリッパーの操作
	 * @param spd スピード
	 */
	private moveFlipperL(spd: number): void {
		if (spd < 0 && this.isPlayAudioFlipperL) {
			this.asset.getAudioById("nc128511").play();
			this.isPlayAudioFlipperL = false;
		} else if (spd > 0) {
			this.isPlayAudioFlipperL = true;
		}
		this.flipperLJoint.SetMotorSpeed(spd);
	}
	/**
	 * 右フリッパーの操作
	 * @param spd スピード
	 */
	private moveFlipperR(spd: number): void {
		if (spd > 0 && this.isPlayAudioFlipperR) {
			this.asset.getAudioById("nc128511").play();
			this.isPlayAudioFlipperR = false;
		} else if (spd < 0) {
			this.isPlayAudioFlipperR = true;
		}
		this.flipperRJoint.SetMotorSpeed(spd);
	}

	private ballPushUp(): void {
		// this.box2d.bodies.forEach((ebody: b2.EBody) => {
		// 	if (ebody.id === this.ballId) {
		// 		// console.log("ボール位置チェック y=" + ebody.b2Body.GetPosition().y * this.box2d.scale);
		// 		if (ebody.b2Body.GetPosition().y > (GB.height + ebody.entity.height) / this.box2d.scale) {
		// 			// console.log("ボール位置リセット");
		// 			ebody.b2Body.SetPosition(this.box2d.vec2(g.game.width / 2, g.game.height + ebody.entity.height));
		// 			ebody.b2Body.SetLinearVelocity(this.box2d.vec2(0, 0));
		// 			ebody.b2Body.SetAngularVelocity(30);
		// 			// 上方向にインパルスを与えて打ち上げる
		// 			if (!DEBUG_DRINK_REMOVE) {
		// 				ebody.b2Body.ApplyImpulse(this.box2d.vec2(30, -700), ebody.b2Body.GetPosition());
		// 			}
		// 			if (DEBUG_DRINK_REMOVE) {
		// 				// debug 削除テスト
		// 				ebody.b2Body.SetAngularVelocity(0);
		// 				ebody.b2Body.SetPosition(this.box2d.vec2(960, 400));
		// 			}
		// 		}
		// 	}
		// });
		if (this.b2Ball.b2Body.GetPosition().y > (GB.height + this.b2Ball.entity.height) / this.box2d.scale) {
			// console.log("ボール位置リセット");
			// this.b2Ball.b2Body.SetPosition(this.box2d.vec2(g.game.width / 2, g.game.height + ebody.entity.height));
			// this.b2Ball.b2Body.SetLinearVelocity(this.box2d.vec2(0, 0));
			// this.b2Ball.b2Body.SetAngularVelocity(30);
			this.setBallPosition(
				g.game.width / 2, g.game.height + this.b2Ball.entity.height,
				this.box2d.vec2(0, 0), 30
			);
			// 上方向にインパルスを与えて打ち上げる
			if (!DEBUG_DRINK_REMOVE) {
				this.b2Ball.b2Body.ApplyImpulse(this.box2d.vec2(30, -700), this.b2Ball.b2Body.GetPosition());
			}
			if (DEBUG_DRINK_REMOVE) {
				// debug 削除テスト
				this.b2Ball.b2Body.SetAngularVelocity(0);
				this.b2Ball.b2Body.SetPosition(this.box2d.vec2(960, 400));
			}
		}
	}
	// ボールがハッカの高さを超えたかチェック
	private ballCheckDrink(b2ball: b2.EBody): void {
		// ボール位置取得
		const ballPosX: number = b2ball.b2Body.GetPosition().x * this.box2d.scale - PADDING_X;
		const ballPosY: number = b2ball.b2Body.GetPosition().y * this.box2d.scale;
		// x:145~190, 160~175 y:500
		// 右ハッカが無い、ボールがチェッカーの範囲内か？
		if (!this.isExistDrinkR) {
			// console.log("ボール位置：" + ballPosX + ", " + ballPosY);
			if (ballPosX >= 160 && ballPosX < 175) {
				if (ballPosY >= 500 && ballPosY < 515) {
					// console.log("ボールが左チェッカーを通った");
					// エンティティの更新
					this.drinkR.frameNumber = 1;
					this.drinkR.modified();
					// ボディの再追加
					this.b2DrinkR = new AkashicB2Body(this.drinkR, this.box2d, B2BodyData.drink).getEBody();
					this.isExistDrinkR = true;
					//
					this.asset.getAudioById("nc273969").play();
				}
			}
		}
		// 左ハッカが無い、ボールがチェッカーの範囲内か？
		if (!this.isExistDrinkL) {
			if (ballPosX >= 625 && ballPosX < 640) {
				if (ballPosY >= 500 && ballPosY < 515) {
					// エンティティの更新
					this.drinkL.frameNumber = 1;
					this.drinkL.modified();
					// ボディの再追加
					this.b2DrinkL = new AkashicB2Body(this.drinkL, this.box2d, B2BodyData.drink).getEBody();
					this.isExistDrinkL = true;
					//
					this.asset.getAudioById("nc273969").play();
				}
			}
		}
	}
	private setBallPosition(
		x: number, y: number,
		vec2: b2.Box2DWeb.Math.vec2 = this.box2d.vec2(0, 0),
		omega: number = 0.0
	): void {
		this.b2Ball.b2Body.SetLinearVelocity(vec2);
		this.b2Ball.b2Body.SetAngularVelocity(omega);
		this.b2Ball.b2Body.SetPosition(this.box2d.vec2(x, y));
	}

	/**
	 * ボディ位置移動(anchor=0.5,0.5前提)
	 * @param b2body 自作クラスのAkashicB2Body
	 * @param x X座標
	 * @param y Y座標
	 */
	private moveB2Body(b2body: AkashicB2Body, x: number, y: number): void {
		// エンティティ
		const entity = b2body.getEntity();
		entity.x = x;
		entity.y = y;
		entity.modified();
		// b2Body
		// const b2Body = b2body.getEBody().b2Body;
		// b2Body.SetPosition(this.box2d.vec2(x, y));
		this._moveB2Body(b2body.getEBody(), x, y);
	}
	private _moveB2Body(b2body: b2.EBody, x: number, y: number): void {
		// b2Body
		b2body.b2Body.SetPosition(this.box2d.vec2(x, y));
	}
}
