import { AkashicB2BodyParameterObject, B2Shape } from "./akashicB2Body";

export class B2BodyData {
	// -----------------------------
	// 左フリッパー
	// -----------------------------
	static flipperL: AkashicB2BodyParameterObject = {
		isDynamic: true,
		b2FixtureDefs: [
			{
				density: 0.5,
				friction: 0.8,
				restitution: 0.2,
			}
		],
		b2Shapes: [B2Shape.poly],
		vertices: [[
			[92 - 92, 10 - 29],
			[172 - 92, 20 - 29],
			[178 - 92, 23 - 29],
			[181 - 92, 29 - 29],
			[178 - 92, 35 - 29],
			[172 - 92, 38 - 29],
			[92 - 92, 48 - 29],
			[78 - 92, 43 - 29],
			[73 - 92, 29 - 29],
			[78 - 92, 15 - 29],
		]]
	};
	// -----------------------------
	// 右フリッパー
	// -----------------------------
	static flipperR: AkashicB2BodyParameterObject = {
		isDynamic: true,
		b2FixtureDefs: [
			{
				density: 0.5,
				friction: 0.8,
				restitution: 0.2,
			}
		],
		b2Shapes: [B2Shape.poly],
		vertices: [[
			[92 - 92, 10 - 29],
			[106 - 92, 15 - 29],
			[111 - 92, 29 - 29],
			[106 - 92, 43 - 29],
			[92 - 92, 48 - 29],
			[12 - 92, 38 - 29],
			[6 - 92, 35 - 29],
			[3 - 92, 29 - 29],
			[6 - 92, 23 - 29],
			[12 - 92, 20 - 29],
		]]
	};
	// -----------------------------
	// 左ガイド
	// -----------------------------
	static guideL: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,				// 密度
			friction: 0.4,			// 摩擦係数
			restitution: 0.2,		// 反発係数
		}],
		b2Shapes: [B2Shape.poly],
		// 150, 200 C:75, 100
		vertices: [[
			[12 - 75, 7 - 100],	// 5px↓
			[19 - 75, 10 - 100],	// 5px↓
			[22 - 75, 17 - 100],	// 5px↓
			[22 - 75, 94 - 100],
			[2 - 75, 131 - 100],
			[2 - 75, 17 - 100],	// 5px↓
			[5 - 75, 10 - 100],	// 5px↓
		], [
			[22 - 75, 94 - 100],
			[130 - 75, 150 - 100],
			[115 - 75, 187 - 100],
			[2 - 75, 131 - 100],
		]],
	};
	// -----------------------------
	// 右ガイド
	// -----------------------------
	static guideR: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,				// 密度
			friction: 0.4,			// 摩擦係数
			restitution: 0.2,		// 反発係数
		}],
		b2Shapes: [B2Shape.poly],
		// 150, 200 C:75, 100
		vertices: [[
			[132 - 75, 7 - 100],	// 5px↓
			[139 - 75, 10 - 100],	// 5px↓
			[142 - 75, 17 - 100],	// 5px↓
			[142 - 75, 131 - 100],
			[122 - 75, 95 - 100],
			[122 - 75, 17 - 100],	// 5px↓
			[125 - 75, 10 - 100],	// 5px↓
		], [
			[122 - 75, 94 - 100],
			[142 - 75, 131 - 100],
			[29 - 75, 187 - 100],
			[14 - 75, 150 - 100],
		]],
	};
	// -----------------------------
	// 左スリングショット
	// -----------------------------
	static slingshotL: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.poly],
		vertices: [[
			[100 - 69 - 50, 6 - 50],
			[100 - 22 - 50, 73 - 50],
			[100 - 28 - 50, 82 - 50],
			[100 - 74 - 50, 57 - 50],
			[100 - 74 - 50, 8 - 50],
		]],
	};
	// -----------------------------
	// 右スリングショット
	// -----------------------------
	static slingshotR: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.poly],
		vertices: [[
			[69 - 50, 6 - 50],
			[74 - 50, 8 - 50],
			[74 - 50, 57 - 50],
			[28 - 50, 82 - 50],
			[22 - 50, 73 - 50],
		]],
	};
	// -----------------------------
	// 左壁
	// -----------------------------
	static wallL: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.poly],
		vertices: [[
			[0 - 150, 0 - 360],
			[35 - 150, 0 - 360],
			[35 - 150, 720 - 360],
			[0 - 150, 720 - 360],
		], [
			[35 - 150, 0 - 360],
			[138 - 150, 0 - 360],
			[138 - 150, 74 - 360],
			[35 - 150, 74 - 360],
		], [
			[35 - 150, 275 - 360],
			[85 - 150, 324 - 360],
			[35 - 150, 324 - 360],
		], [
			[35 - 150, 325 - 360],
			[85 - 150, 325 - 360],			// 留まるので坂にした
			[118 - 150, 330 - 360],			// 留まるので坂にした
			[118 - 150, 394 - 360],
			[35 - 150, 394 - 360],
		], [
			// 台形
			[35 - 150, 395 - 360],
			[113 - 150, 395 - 360],
			[92 - 150, 404 - 360],
			[35 - 150, 404 - 360],
		], [
			[35 - 150, 405 - 360],
			[90 - 150, 405 - 360],
			[75 - 150, 419 - 360],
			[35 - 150, 419 - 360],
		], [
			[35 - 150, 420 - 360],
			[74 - 150, 420 - 360],
			[70 - 150, 429 - 360],
			[35 - 150, 429 - 360],
		], [
			// 四角形
			[35 - 150, 430 - 360],
			[68 - 150, 430 - 360],
			[68 - 150, 599 - 360],
			[35 - 150, 599 - 360],
		], [
			// 鈍角三角形
			[35 - 150, 600 - 360],
			[69 - 150, 600 - 360],
			[84 - 150, 620 - 360],
		], [
			// 大三角形(底)
			[35 - 150, 600 - 360],
			[287 - 150, 720 - 360],
			[35 - 150, 720 - 360],
		]],
	};
	// -----------------------------
	// 右壁
	// -----------------------------
	static wallR: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.poly],
		vertices: [[
			[300 - 0 - 150, 0 - 360],
			[300 - 0 - 150, 720 - 360],
			[300 - 35 - 150, 720 - 360],
			[300 - 35 - 150, 0 - 360],
		], [
			[300 - 35 - 150, 0 - 360],
			[300 - 35 - 150, 75 - 360],
			[300 - 138 - 150, 75 - 360],
			[300 - 138 - 150, 0 - 360],
		], [
			[300 - 35 - 150, 275 - 360],
			[300 - 35 - 150, 324 - 360],
			[300 - 85 - 150, 324 - 360],
		], [
			[300 - 35 - 150, 325 - 360],
			[300 - 35 - 150, 394 - 360],
			[300 - 118 - 150, 394 - 360],
			[300 - 118 - 150, 330 - 360],		// 留まるので坂にした
			[300 - 85 - 150, 325 - 360],		// 留まるので坂にした
		], [
			// 台形
			[300 - 35 - 150, 395 - 360],
			[300 - 35 - 150, 404 - 360],
			[300 - 92 - 150, 404 - 360],
			[300 - 113 - 150, 395 - 360],
		], [
			[300 - 35 - 150, 405 - 360],
			[300 - 35 - 150, 419 - 360],
			[300 - 75 - 150, 419 - 360],
			[300 - 90 - 150, 405 - 360],
		], [
			[300 - 35 - 150, 420 - 360],
			[300 - 35 - 150, 429 - 360],
			[300 - 70 - 150, 429 - 360],
			[300 - 74 - 150, 420 - 360],
		], [
			// 四角形
			[300 - 35 - 150, 430 - 360],
			[300 - 35 - 150, 599 - 360],
			[300 - 68 - 150, 599 - 360],
			[300 - 68 - 150, 430 - 360],
		], [
			// 鈍角三角形
			[300 - 35 - 150, 600 - 360],
			[300 - 84 - 150, 620 - 360],
			[300 - 69 - 150, 600 - 360],
		], [
			// 大三角形(底)
			[300 - 35 - 150, 600 - 360],
			[300 - 35 - 150, 720 - 360],
			[300 - 287 - 150, 720 - 360],
		]],
	};
	// -----------------------------
	// 天井ブロック上１
	// -----------------------------
	static wallU1: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.rect],
		vertices: [[[135, 8]]],
	};
	// -----------------------------
	// 天井ブロック上２
	// -----------------------------
	static wallU2: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.rect],
		vertices: [[[135, 8]]],
	};
	// -----------------------------
	// 天井ブロック左
	// -----------------------------
	static wallUL: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.rect],
		vertices: [[[80, 80]]],
	};
	// -----------------------------
	// 天井ブロック右
	// -----------------------------
	static wallUR: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.rect],
		vertices: [[[80, 80]]],
	};
	// -----------------------------
	// ボール
	// -----------------------------
	static ball: AkashicB2BodyParameterObject = {
		isDynamic: true,
		b2FixtureDefs: [{
			density: 1.5,				// 密度
			friction: 0.4,			// 摩擦係数
			restitution: 0.2,		// 反発係数
		}],
		b2Shapes: [B2Shape.circle],
		vertices: [[[50]]],		// 半径
	};
	// -----------------------------
	// ハッカ油
	// -----------------------------
	static drink: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.rect],
		vertices: [[[40, 80]]],
	};
	// -----------------------------
	// ニコモバ
	// -----------------------------
	static moba: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.8,
		}],
		b2Shapes: [B2Shape.circle],
		vertices: [[[50]]],		// 半径
	};
	// -----------------------------
	// ナマコ
	// -----------------------------
	static namako: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.8,
		}],
		b2Shapes: [B2Shape.circle],
		vertices: [[[50]]],		// 半径
	};
	// -----------------------------
	// アツマライオン
	// -----------------------------
	static lion: AkashicB2BodyParameterObject = {
		isDynamic: false,
		b2FixtureDefs: [{
			density: 0.5,
			friction: 0.4,
			restitution: 0.2,
		}],
		b2Shapes: [B2Shape.poly],
		// C:50,50
		vertices: [[
			[50 - 50, 15 - 50],
			[80 - 50, 32 - 50],
			[80 - 50, 67 - 50],
			[50 - 50, 84 - 50],
			[19 - 50, 67 - 50],
			[19 - 50, 32 - 50],
		]],
	};
}
