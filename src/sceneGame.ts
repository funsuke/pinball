// GBの解像度 160 x 144
// height を 720 にして、5倍に拡大して表示する
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
		// // Body設定
		// const b2FlipperBody: b2.Box2DWeb = this.box2d.createBodyDef({
		// 	type: b2.BodyType.Dynamic,
		// });
		// // C:92,29 w185:h59
		// const vertices: number[][] = [];
		// vertices.push([
		// 	this.box2d.vec2(92 - 92, 10 - 29),
		// 	this.box2d.vec2(172 - 92, 20 - 29),
		// 	this.box2d.vec2(178 - 92, 23 - 29),
		// 	this.box2d.vec2(181 - 92, 29 - 29),
		// 	this.box2d.vec2(178 - 92, 35 - 29),
		// 	this.box2d.vec2(172 - 92, 38 - 29),
		// 	this.box2d.vec2(92 - 92, 48 - 29),
		// 	this.box2d.vec2(78 - 92, 43 - 29),
		// 	this.box2d.vec2(73 - 92, 29 - 29),
		// 	this.box2d.vec2(78 - 92, 15 - 29),
		// ]);
		// // Fixture設定
		// const b2FlipperRFixture: b2.Box2DWeb = this.box2d.createFixtureDef({
		// 	density: 0.5,				// 密度
		// 	friction: 0.4,			// 摩擦係数
		// 	restitution: 0.2,		// 反発係数
		// 	shape: this.box2d.createPolygonShape(vertices[0]),	// 形状
		// });
		// // b2Body
		// const b2FlipperR = this.box2d.createBody(flipperR, b2FlipperBody, b2FlipperRFixture);
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
		// wheel.onUpdate.add(() => {
		// 	const angle = b2Wheel?.b2Body.GetAngle();
		// 	if (angle >= revoluteJointR.GetUpperLimit()) {
		// 		// revoluteJointR.SetAngle(52 * Math.PI / 180);
		// 		revoluteJointR.SetMotorSpeed(0.0);
		// 	} else if (angle <= revoluteJointR.GetLowerLimit()) {
		// 		// revoluteJointR.SetAngle(0);
		// 		revoluteJointR.SetMotorSpeed(0.0);
		// 	}
		// });
		// const vec2Pos = b2FlipperR?.b2Body.GetPosition();
		// console.log("FlipperR : " + vec2Pos?.x + ", " + vec2Pos?.y);
		// 15.44, 12.34 => 772 / box2d.scale, 617 / box2d.scale
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
		// // 頂点設定 C92,29
		// vertices[0] = [];
		// vertices[0] = [
		// 	this.box2d.vec2(92 - 92, 10 - 29),
		// 	this.box2d.vec2(106 - 92, 15 - 29),
		// 	this.box2d.vec2(111 - 92, 29 - 29),
		// 	this.box2d.vec2(106 - 92, 43 - 29),
		// 	this.box2d.vec2(92 - 92, 48 - 29),
		// 	this.box2d.vec2(12 - 92, 38 - 29),
		// 	this.box2d.vec2(6 - 92, 35 - 29),
		// 	this.box2d.vec2(3 - 92, 29 - 29),
		// 	this.box2d.vec2(6 - 92, 23 - 29),
		// 	this.box2d.vec2(12 - 92, 20 - 29),
		// ];
		// // Fixture設定
		// const b2FlipperLFixture = this.box2d.createFixtureDef({
		// 	density: 0.5,
		// 	friction: 0.4,
		// 	restitution: 0.2,
		// 	shape: this.box2d.createPolygonShape(vertices[0]),
		// });
		// // b2Body
		// const b2FlipperL = this.box2d.createBody(flipperL, b2FlipperBody, b2FlipperLFixture);
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
		// イベント
		// this.flipperL.onPointDown.add((ev: g.PointDownEvent) => {
		// 	// this.flipperL.angle = 180 + 17 - 52;
		// 	// this.flipperL.modified();
		// 	b2FlipperL?.b2Body.SetAngle((180 + 17 - 52) * Math.PI / 180);
		// 	// console.log(b2FlipperL?.b2Body.GetPosition());
		// 	// const vec2 = b2FlipperL?.b2Body.GetPosition();
		// 	// R=35, cos(52)=0.61566, sin(52)=0.78801
		// 	const vec2 = this.box2d.vec2(
		// 		// 505 - 13 - 21.55 + this.flipperL.width / 2,
		// 		// 615 - 19 - 27.58 + this.flipperL.height / 2,
		// 		505 + 29.8424,
		// 		615 - 18.2874,
		// 	);
		// 	b2FlipperL?.b2Body.SetPosition(vec2);
		// });
		// this.flipperL.onPointUp.add((ev: g.PointUpEvent) => {
		// 	b2FlipperL?.b2Body.SetAngle((180 + 17) * Math.PI / 180);
		// 	console.log(this.flipperL.width, this.flipperL.height);	// 127, 59
		// 	const vec2 = this.box2d.vec2(
		// 		// 505 - 30 + this.flipperL.width / 2,		// → 127/2=63.5 - 28=35.5	// 127-98=29
		// 		// 615 - 20 + this.flipperL.height / 2,	// → 59/2=29.5 - 19=10.5	// 59-29=30
		// 		505 + 33.7595,
		// 		615 - 9.2356 + 29.5 / 2 + 14.75 / 2,
		// 	);
		// 	// const vec2 = this.box2d.vec2(505, 615);
		// 	b2FlipperL?.b2Body.SetPosition(vec2);
		// });
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
		// // body設定
		// const guideRBodyDef: b2.Box2DWeb = this.box2d.createBodyDef({
		// 	type: b2.BodyType.Static,
		// });
		// // 頂点設定
		// vertices[0] = [];
		// vertices[0] = [
		// 	this.box2d.vec2(180 - 109, 16 - 109),	// 5px↓
		// 	this.box2d.vec2(187 - 109, 19 - 109),	// 5px↓
		// 	this.box2d.vec2(190 - 109, 26 - 109),	// 5px↓
		// 	this.box2d.vec2(190 - 109, 140 - 109),
		// 	this.box2d.vec2(170 - 109, 140 - 109),
		// 	this.box2d.vec2(170 - 109, 26 - 109),	// 5px↓
		// 	this.box2d.vec2(173 - 109, 19 - 109),	// 5px↓
		// ];
		// vertices.push([
		// 	this.box2d.vec2(170 - 109, 103 - 109),
		// 	this.box2d.vec2(190 - 109, 140 - 109),
		// 	// this.box2d.vec2(49 - 109, 207 - 109),
		// 	// this.box2d.vec2(45 - 109, 207 - 109),
		// 	// this.box2d.vec2(32 - 109, 202 - 109),
		// 	// this.box2d.vec2(27 - 109, 189 - 109),
		// 	// this.box2d.vec2(32 - 109, 176 - 109),
		// 	this.box2d.vec2(77 - 109, 196 - 109),
		// 	this.box2d.vec2(62 - 109, 159 - 109),
		// ]);
		// // fixture設定
		// const guideRFixDef: b2.Box2DWeb[] = [
		// 	this.box2d.createFixtureDef({
		// 		density: 0.5,				// 密度
		// 		friction: 0.4,			// 摩擦係数
		// 		restitution: 0.2,		// 反発係数
		// 		shape: this.box2d.createPolygonShape(vertices[0]),	// 形状
		// 	})
		// 	,
		// 	this.box2d.createFixtureDef({
		// 		density: 0.5,				// 密度
		// 		friction: 0.4,			// 摩擦係数
		// 		restitution: 0.2,		// 反発係数
		// 		shape: this.box2d.createPolygonShape(vertices[1]),	// 形状
		// 	})
		// ];
		// // b2Body
		// this.box2d.createBody(guideRight, guideRBodyDef, guideRFixDef);
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
		// //
		// vertices[0] = [];
		// vertices[0] = [
		// 	this.box2d.vec2(38 - 109, 16 - 109),	// 5px↓
		// 	this.box2d.vec2(45 - 109, 19 - 109),	// 5px↓
		// 	this.box2d.vec2(48 - 109, 26 - 109),	// 5px↓
		// 	this.box2d.vec2(48 - 109, 140 - 109),
		// 	this.box2d.vec2(28 - 109, 140 - 109),
		// 	this.box2d.vec2(28 - 109, 26 - 109),	// 5px↓
		// 	this.box2d.vec2(31 - 109, 19 - 109),	// 5px↓
		// ];
		// vertices[1] = [];
		// vertices[1] = [
		// 	this.box2d.vec2(48 - 109, 103 - 109),
		// 	// this.box2d.vec2(186 - 109, 176 - 109),
		// 	// this.box2d.vec2(191 - 109, 189 - 109),
		// 	// this.box2d.vec2(186 - 109, 202 - 109),
		// 	// this.box2d.vec2(173 - 109, 207 - 109),
		// 	// this.box2d.vec2(169 - 109, 207 - 109),
		// 	this.box2d.vec2(156 - 109, 159 - 109),
		// 	this.box2d.vec2(141 - 109, 196 - 109),
		// 	this.box2d.vec2(28 - 109, 140 - 109),
		// ];
		// const guideLFixDef: b2.Box2DWeb[] = [
		// 	this.box2d.createFixtureDef({
		// 		density: 0.5,				// 密度
		// 		friction: 0.4,			// 摩擦係数
		// 		restitution: 0.2,		// 反発係数
		// 		shape: this.box2d.createPolygonShape(vertices[0]),	// 形状
		// 	})
		// 	,
		// 	this.box2d.createFixtureDef({
		// 		density: 0.5,				// 密度
		// 		friction: 0.4,			// 摩擦係数
		// 		restitution: 0.2,		// 反発係数
		// 		shape: this.box2d.createPolygonShape(vertices[1]),	// 形状
		// 	})
		// ];
		// const guideLBodyDef: b2.Box2DWeb = this.box2d.createBodyDef({
		// 	type: b2.BodyType.Static,
		// });
		// this.box2d.createBody(guideLeft, guideLBodyDef, guideLFixDef);
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
		// //
		// vertices[0] = [
		// 	this.box2d.vec2(69 - 50, 6 - 50),
		// 	this.box2d.vec2(74 - 50, 8 - 50),
		// 	this.box2d.vec2(74 - 50, 57 - 50),
		// 	this.box2d.vec2(28 - 50, 82 - 50),
		// 	this.box2d.vec2(22 - 50, 73 - 50),
		// ];
		// const b2SlingshotBody: b2.Box2DWeb = this.box2d.createBodyDef({
		// 	type: b2.BodyType.Static,
		// });
		// const b2SlingshotFixture: b2.Box2DWeb = this.box2d.createFixtureDef({
		// 	density: 0.5,				// 密度
		// 	friction: 0.4,			// 摩擦係数
		// 	restitution: 0.2,		// 反発係数
		// 	shape: this.box2d.createPolygonShape(vertices[0]),	// 形状
		// });
		// const b2SlingshotRBody: b2.Box2DWeb.b2Body = this.box2d.createBody(slingshotR, b2SlingshotBody, b2SlingshotFixture);
		// this.box2d.createBody(slingshotR, b2SlingshotBody, b2SlingshotFixture);
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
		// // C:50,50
		// vertices[0] = [
		// 	this.box2d.vec2(100 - 69 - 50, 6 - 50),
		// 	this.box2d.vec2(100 - 22 - 50, 73 - 50),
		// 	this.box2d.vec2(100 - 28 - 50, 82 - 50),
		// 	this.box2d.vec2(100 - 74 - 50, 57 - 50),
		// 	this.box2d.vec2(100 - 74 - 50, 8 - 50),
		// ];
		// b2SlingshotFixture.shape = this.box2d.createPolygonShape(vertices[0]);	// 形状
		// // b2Body設定
		// const b2SlingshotLBody: b2.Box2DWeb.b2Body = this.box2d.createBody(slingshotL, b2SlingshotBody, b2SlingshotFixture);
		// this.box2d.createBody(slingshotL, b2SlingshotBody, b2SlingshotFixture);
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
		// // Body設定
		// const b2WallBody: b2.Box2DWeb = this.box2d.createBodyDef({
		// 	type: b2.BodyType.Static,
		// });
		// // C:150,360
		// vertices[0] = [
		// 	this.box2d.vec2(0 - 150, 0 - 360),
		// 	this.box2d.vec2(35 - 150, 0 - 360),
		// 	this.box2d.vec2(35 - 150, 720 - 360),
		// 	this.box2d.vec2(0 - 150, 720 - 360),
		// ];
		// vertices[1] = [
		// 	this.box2d.vec2(35 - 150, 0 - 360),
		// 	this.box2d.vec2(138 - 150, 0 - 360),
		// 	this.box2d.vec2(138 - 150, 74 - 360),
		// 	this.box2d.vec2(35 - 150, 74 - 360),
		// ];
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 275 - 360),
		// 	this.box2d.vec2(85 - 150, 324 - 360),
		// 	this.box2d.vec2(35 - 150, 324 - 360),
		// ]);
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 325 - 360),
		// 	this.box2d.vec2(118 - 150, 325 - 360),
		// 	this.box2d.vec2(118 - 150, 394 - 360),
		// 	this.box2d.vec2(35 - 150, 394 - 360),
		// ]);
		// // 台形
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 395 - 360),
		// 	this.box2d.vec2(113 - 150, 395 - 360),
		// 	this.box2d.vec2(92 - 150, 404 - 360),
		// 	this.box2d.vec2(35 - 150, 404 - 360),
		// ]);
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 405 - 360),
		// 	this.box2d.vec2(90 - 150, 405 - 360),
		// 	this.box2d.vec2(75 - 150, 419 - 360),
		// 	this.box2d.vec2(35 - 150, 419 - 360),
		// ]);
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 420 - 360),
		// 	this.box2d.vec2(74 - 150, 420 - 360),
		// 	this.box2d.vec2(70 - 150, 429 - 360),
		// 	this.box2d.vec2(35 - 150, 429 - 360),
		// ]);
		// // 四角形
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 430 - 360),
		// 	this.box2d.vec2(68 - 150, 430 - 360),
		// 	this.box2d.vec2(68 - 150, 599 - 360),
		// 	this.box2d.vec2(35 - 150, 599 - 360),
		// ]);
		// // 鈍角三角形
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 600 - 360),
		// 	this.box2d.vec2(69 - 150, 600 - 360),
		// 	this.box2d.vec2(84 - 150, 620 - 360),
		// ]);
		// // 大三角形(底)
		// vertices.push([
		// 	this.box2d.vec2(35 - 150, 600 - 360),
		// 	this.box2d.vec2(287 - 150, 720 - 360),
		// 	this.box2d.vec2(35 - 150, 720 - 360),
		// ]);
		// // Fixture設定
		// const wallLFixDef: b2.Box2DWeb[] = [];
		// for (let i = 0; i < 10; i++) {
		// 	wallLFixDef.push(
		// 		this.box2d.createFixtureDef({
		// 			density: 0.5,				// 密度
		// 			friction: 0.4,			// 摩擦係数
		// 			restitution: 0.2,		// 反発係数
		// 			shape: this.box2d.createPolygonShape(vertices[i]),	// 形状
		// 		})
		// 	);
		// };
		// // const b2WallL = this.box2d.createBody(wallL, b2WallBody, wallLFixDef);
		// this.box2d.createBody(wallL, b2WallBody, wallLFixDef);
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
		// // C:150,360
		// vertices[0] = [
		// 	this.box2d.vec2(300 - 0 - 150, 0 - 360),
		// 	this.box2d.vec2(300 - 0 - 150, 720 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 720 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 0 - 360),
		// ];
		// vertices[1] = [
		// 	this.box2d.vec2(300 - 35 - 150, 0 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 75 - 360),
		// 	this.box2d.vec2(300 - 138 - 150, 75 - 360),
		// 	this.box2d.vec2(300 - 138 - 150, 0 - 360),
		// ];
		// vertices[2] = [
		// 	this.box2d.vec2(300 - 35 - 150, 275 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 324 - 360),
		// 	this.box2d.vec2(300 - 85 - 150, 324 - 360),
		// ];
		// vertices[3] = [
		// 	this.box2d.vec2(300 - 35 - 150, 325 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 394 - 360),
		// 	this.box2d.vec2(300 - 118 - 150, 394 - 360),
		// 	this.box2d.vec2(300 - 118 - 150, 325 - 360),
		// ];
		// // 台形
		// vertices[4] = [
		// 	this.box2d.vec2(300 - 35 - 150, 395 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 404 - 360),
		// 	this.box2d.vec2(300 - 92 - 150, 404 - 360),
		// 	this.box2d.vec2(300 - 113 - 150, 395 - 360),
		// ];
		// vertices[5] = [
		// 	this.box2d.vec2(300 - 35 - 150, 405 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 419 - 360),
		// 	this.box2d.vec2(300 - 75 - 150, 419 - 360),
		// 	this.box2d.vec2(300 - 90 - 150, 405 - 360),
		// ];
		// vertices[6] = [
		// 	this.box2d.vec2(300 - 35 - 150, 420 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 429 - 360),
		// 	this.box2d.vec2(300 - 70 - 150, 429 - 360),
		// 	this.box2d.vec2(300 - 74 - 150, 420 - 360),
		// ];
		// // 四角形
		// vertices[7] = [
		// 	this.box2d.vec2(300 - 35 - 150, 430 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 599 - 360),
		// 	this.box2d.vec2(300 - 68 - 150, 599 - 360),
		// 	this.box2d.vec2(300 - 68 - 150, 430 - 360),
		// ];
		// // 鈍角三角形
		// vertices[8] = [
		// 	this.box2d.vec2(300 - 35 - 150, 600 - 360),
		// 	this.box2d.vec2(300 - 84 - 150, 620 - 360),
		// 	this.box2d.vec2(300 - 69 - 150, 600 - 360),
		// ];
		// // 大三角形(底)
		// vertices[9] = [
		// 	this.box2d.vec2(300 - 35 - 150, 600 - 360),
		// 	this.box2d.vec2(300 - 35 - 150, 720 - 360),
		// 	this.box2d.vec2(300 - 287 - 150, 720 - 360),
		// ];
		// // Fixture設定
		// const wallRFixDef: b2.Box2DWeb[] = [];
		// for (let i = 0; i < 10; i++) {
		// 	wallRFixDef.push(
		// 		this.box2d.createFixtureDef({
		// 			density: 0.5,				// 密度
		// 			friction: 0.4,			// 摩擦係数
		// 			restitution: 0.2,		// 反発係数
		// 			shape: this.box2d.createPolygonShape(vertices[i]),	// 形状
		// 		})
		// 	);
		// };
		// // b2Body設定
		// // const b2WallR = this.box2d.createBody(wallR, b2WallBody, wallRFixDef);
		// this.box2d.createBody(wallR, b2WallBody, wallRFixDef);
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
		// // Fixture設定
		// const wallUFixDef = this.box2d.createFixtureDef({
		// 	density: 0.5,
		// 	friction: 0.4,
		// 	restitution: 0.2,
		// 	shape: this.box2d.createRectShape(g.game.width, 8),
		// });
		// // b2Body
		// // const b2WallU = this.box2d.createBody(wallU, b2WallBody, wallUFixDef);
		// this.box2d.createBody(wallU, b2WallBody, wallUFixDef);
		// 天井ブロック左
		const wallUL = new g.FilledRect({
			scene: this,
			cssColor: "red",
			width: 80, height: 80,
			x: PADDING_X + 260, y: 0,
			parent: this,
		});
		// AkashicB2Body設定
		new AkashicB2Body(wallUL, this.box2d, B2BodyData.wallUL);
		// // Fixture設定
		// const wallULFixDef = this.box2d.createFixtureDef({
		// 	density: 0.5,
		// 	friction: 0.4,
		// 	restitution: 0.2,
		// 	shape: this.box2d.createRectShape(80, 80),
		// });
		// // b2Body
		// // const b2WallUL = this.box2d.createBody(wallUL, b2WallBody, wallULFixDef);
		// this.box2d.createBody(wallUL, b2WallBody, wallULFixDef);
		// 天井ブロック右
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
		// // Fixture設定
		// const wallURFixDef = this.box2d.createFixtureDef({
		// 	density: 0.5,
		// 	friction: 0.4,
		// 	restitution: 0.2,
		// 	shape: this.box2d.createRectShape(80, 80),
		// });
		// // b2Body
		// // const b2WallUR = this.box2d.createBody(wallUR, b2WallBody, wallURFixDef);
		// this.box2d.createBody(wallUR, b2WallBody, wallURFixDef);
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
		// const ballFixDef: b2.Box2DWeb = this.box2d.createFixtureDef({
		// 	density: 1.5,				// 密度
		// 	friction: 0.4,			// 摩擦係数
		// 	restitution: 0.2,		// 反発係数
		// 	shape: this.box2d.createCircleShape(50),	// 形状 78
		// });
		// const ballDef: b2.Box2DWeb = this.box2d.createBodyDef({
		// 	type: b2.BodyType.Dynamic,	// 動的
		// });
		// const b2Ball: b2.Box2DWeb.b2Body = this.box2d.createBody(ball, ballDef, ballFixDef);
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
	private moveFlipperL(spd: number): void {
		this.flipperL.SetMotorSpeed(spd);
	}
	private moveFlipperR(spd: number): void {
		this.flipperR.SetMotorSpeed(spd);
	}
}
