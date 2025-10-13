// GBの解像度 160 x 144
// height を 720 にする(5倍に拡大して表示する)
// → 800 x 720
import * as b2 from "@akashic-extension/akashic-box2d";
import { AkashicB2Body } from "./akashicB2Body";
import { B2BodyData } from "./b2BodyData";

const GB = {
	width: 800,
	height: 720,
};

const PADDING_X: number = (g.game.width - GB.width) / 2;
const FLIPPER_TORQUE: number = 800;

const FLIPPER_SPEED: number = 13.0;
declare const window: any;

// *************************************************
// ゲームシーン
// *************************************************
export class SceneGame extends g.Scene {
	private box2d: b2.Box2D;
	private flipperL: b2.Box2DWeb.Dynamics.Joints.b2RevoluteJoint;
	private flipperR: b2.Box2DWeb.Dynamics.Joints.b2RevoluteJoint;
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
		});
		// キー入力イベント
		window.addEventListener("keydown", (ev: any) => {
			switch (ev.keyCode) {
				case 65:	// A
				case 37:	// ←
					this.moveFlipperL(-FLIPPER_SPEED);
					break;
				case 68:	// D
				case 39:	// →
					this.moveFlipperR(+FLIPPER_SPEED);
					break;
			};
		});
		window.addEventListener("keyup", (ev: any) => {
			// console.log(ev.keyCode);
			switch (ev.keyCode) {
				case 65:	// A
				case 37:	// ←
					this.moveFlipperL(+FLIPPER_SPEED);
					break;
				case 68:	// D
				case 39:	// →
					this.moveFlipperR(-FLIPPER_SPEED);
					break;
			};
		});
	}

	private _Load(param: g.GameMainParameterObject): void {
		// BGM再生
		// this.asset.getAudioById("8bit-hoshi-carnival").play().changeVolume(0.3);
		// Box2D初期化
		this.box2d = new b2.Box2D({
			gravity: [0, 9.8],
			scale: 50,
			sleep: true,
		});
		// -------------------------------------------------------------
		// 右フリッパー
		// -------------------------------------------------------------
		// エンティティ
		const flipperR = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("flipperR"),
			// anchorX: 98 / 127, anchorY: 29 / 59,
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width / 2 + 132, y: 617,
			angle: 180 - 17,
			parent: this,
		});
		// AkashicB2Body設定
		const b2FlipperR: b2.EBody = new AkashicB2Body(flipperR, this.box2d, B2BodyData.flipperR).getEBody();
		// 右フリッパージョイント設定
		let revoluteJointDef = new b2.Box2DWeb.Dynamics.Joints.b2RevoluteJointDef();
		revoluteJointDef.Initialize(this.box2d.world.GetGroundBody(), b2FlipperR?.b2Body, this.box2d.vec2(g.game.width / 2 + 132, 617));
		revoluteJointDef.maxMotorTorque = FLIPPER_TORQUE;
		revoluteJointDef.motorSpeed = 0.0;
		revoluteJointDef.enableMotor = true;
		revoluteJointDef.lowerAngle = 0 * Math.PI / 180;
		revoluteJointDef.upperAngle = 52 * Math.PI / 180;
		revoluteJointDef.enableLimit = true;
		this.flipperR = this.box2d.world.CreateJoint(revoluteJointDef);
		this.onPointDownCapture.add((ev: g.PointDownEvent) => {
			if (ev.point.x < g.game.width / 2) {
				this.moveFlipperL(-FLIPPER_SPEED);
			} else {
				this.moveFlipperR(+FLIPPER_SPEED);
			}
		});
		this.onPointUpCapture.add((ev: g.PointUpEvent) => {
			if (ev.point.x < g.game.width / 2) {
				this.moveFlipperL(+FLIPPER_SPEED);
			} else {
				this.moveFlipperR(-FLIPPER_SPEED);
			}
		});
		// -------------------------------------------------------------
		// 左フリッパー
		// -------------------------------------------------------------
		// エンティティ
		const flipperL = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("flipper"),
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width / 2 - 132, y: 617,
			// angle: 180 + 17 - 52,
			angle: 180 + 17,
			parent: this,
		});
		// AkashicB2Body設定
		const b2FlipperL: b2.EBody = new AkashicB2Body(flipperL, this.box2d, B2BodyData.flipperL).getEBody();
		// 左フリッパージョイント設定
		revoluteJointDef = new b2.Box2DWeb.Dynamics.Joints.b2RevoluteJointDef();
		revoluteJointDef.Initialize(this.box2d.world.GetGroundBody(), b2FlipperL?.b2Body, this.box2d.vec2(g.game.width / 2 - 132, 617));
		revoluteJointDef.maxMotorTorque = FLIPPER_TORQUE;
		revoluteJointDef.motorSpeed = 0.0;
		revoluteJointDef.enableMotor = true;
		revoluteJointDef.lowerAngle = -52 * Math.PI / 180;
		revoluteJointDef.upperAngle = 0 * Math.PI / 180;
		revoluteJointDef.enableLimit = true;
		this.flipperL = this.box2d.world.CreateJoint(revoluteJointDef);
		// -------------------------------------------------------------
		// 右ガイド	C:109,109
		// -------------------------------------------------------------
		// エンティティ
		const guideRight = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("guideRight"),
			x: g.game.width / 2 + 90, y: 429,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(guideRight, this.box2d, B2BodyData.guideR).getEBody();
		// -------------------------------------------------------------
		// 左ガイド
		// -------------------------------------------------------------
		// エンティティ
		const guideLeft = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("guideLeft"),
			anchorX: 1.0,
			x: g.game.width / 2 - 90, y: 429,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(guideLeft, this.box2d, B2BodyData.guideL);
		// -------------------------------------------------------------
		// 右スリングショット
		// -------------------------------------------------------------
		const slingshotR = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("slingshotL"),
			x: g.game.width / 2 + 130, y: 440,
			parent: this,
		});
		// AkashicB2Body設定
		const b2SlingshotR: b2.EBody = new AkashicB2Body(slingshotR, this.box2d, B2BodyData.slingshotR).getEBody();
		// -------------------------------------------------------------
		// 左スリングショット
		// -------------------------------------------------------------
		const slingshotL = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("slingshotR"),
			anchorX: 1.0,
			x: g.game.width / 2 - 130, y: 440,
			parent: this,
		});
		// AkashicB2Body設定
		const b2SlingshotL: b2.EBody = new AkashicB2Body(slingshotL, this.box2d, B2BodyData.slingshotL).getEBody();
		// -------------------------------------------------------------
		// 左壁
		// -------------------------------------------------------------
		const wallL = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("wallL"),
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
			src: this.asset.getImageById("wallR"),
			anchorX: 1.0,
			x: g.game.width - 240, y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallR, this.box2d, B2BodyData.wallR);
		// -------------------------------------------------------------
		// 天井
		// -------------------------------------------------------------
		const wallU = new g.E({
			scene: this,
			width: g.game.width,
			height: 8,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallU, this.box2d, B2BodyData.wallU);
		// -------------------------------------------------------------
		// 天井ブロック左
		// -------------------------------------------------------------
		const wallUL = new g.FilledRect({
			scene: this,
			cssColor: "red",
			width: 80, height: 80,
			x: PADDING_X + 260, y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallUL, this.box2d, B2BodyData.wallUL);
		// -------------------------------------------------------------
		// 天井ブロック右
		// -------------------------------------------------------------
		const wallUR = new g.FilledRect({
			scene: this,
			cssColor: "blue",
			width: 80, height: 80,
			anchorX: 1.0,
			x: g.game.width - (PADDING_X + 260), y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallUR, this.box2d, B2BodyData.wallUR);
		// -------------------------------------------------------------
		// ボール
		// -------------------------------------------------------------
		const ball = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("ball"),
			anchorX: 0.5, anchorY: 0.5,
			// x: 320, y: 400, // ボッシュートテスト
			// x: 840, y: 400,
			x: 470, y: 200,
			parent: this,
		});
		// AkashicB2Body設定
		const b2Ball: b2.EBody = new AkashicB2Body(ball, this.box2d, B2BodyData.ball).getEBody();
		// テスト画像
		// new g.Sprite({
		// 	scene: this,
		// 	src: this.asset.getImageById("sample2"),
		// 	x: (g.game.width - 800) / 2,
		// 	opacity: 0.5,
		// 	parent: this,
		// });
		// -------------------------------------------------------------
		// 衝突検出
		// -------------------------------------------------------------
		const contactListener = new b2.Box2DWeb.Dynamics.b2ContactListener;
		contactListener.BeginContact = ((contact: b2.Box2DWeb) => {
			if (this.box2d.isContact(b2Ball, b2SlingshotL, contact)) {
				const vec2: b2.Box2DWeb.vec2 = contact.GetManifold().m_localPlaneNormal;
				console.log("x = " + vec2.x + ", y = " + vec2.y);
				console.log("ボールと左スリングショットが衝突");
				if (vec2.x > 0 && vec2.y < 0) {
					b2Ball.b2Body.ApplyImpulse(this.box2d.vec2(780, -450), b2Ball.b2Body.GetPosition());
				}
			}
			if (this.box2d.isContact(b2Ball, b2SlingshotR, contact)) {
				const vec2: b2.Box2DWeb.vec2 = contact.GetManifold().m_localPlaneNormal;
				console.log("x = " + vec2.x + ", y = " + vec2.y);
				console.log("ボールと右スリングショットが衝突");
				if (vec2.x < 0 && vec2.y < 0) {
					b2Ball.b2Body.ApplyImpulse(this.box2d.vec2(-780, -450), b2Ball.b2Body.GetPosition());
				}
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
		this.flipperL.SetMotorSpeed(spd);
	}
	/**
	 * 右フリッパーの操作
	 * @param spd スピード
	 */
	private moveFlipperR(spd: number): void {
		this.flipperR.SetMotorSpeed(spd);
	}
}
