import * as b2 from "@akashic-extension/akashic-box2d";

export enum B2Shape {
	circle = 0,
	poly,
	rect
}

export interface AkashicB2BodyParameterObject {
	b2FixtureDefs: b2.Box2DFixtureDef[];
	b2Shapes: B2Shape[];
	vertices: number[][][];
	isDynamic: boolean;
};

export class AkashicB2Body {
	private entity: g.E | g.Sprite;
	private box2d: b2.Box2D;
	private b2Body: b2.EBody;
	private b2FixtureDefs: b2.Box2DFixtureDef[];
	private b2Shapes: B2Shape[];
	private vertices: number[][][];
	private isDynamic: boolean;
	//
	constructor(entity: g.E, box2d: b2.Box2D, p: AkashicB2BodyParameterObject) {
		//
		this.entity = entity;
		this.box2d = box2d;
		this.b2FixtureDefs = p.b2FixtureDefs;
		this.b2Shapes = p.b2Shapes;
		this.vertices = p.vertices;
		this.isDynamic = p.isDynamic;
		//
		this.init();
	}
	set Box2D(box2d: b2.Box2D) {
		this.box2d = box2d;
	}
	//
	public getEBody(): b2.EBody {
		return this.b2Body;
	}
	//
	private init(): void {
		// Body設定
		const type: number | undefined = this.isDynamic ? b2.BodyType.Dynamic : b2.BodyType.Static;
		const b2BodyDef = this.box2d.createBodyDef({
			type: type,
		});
		// Fixture設定
		const b2FixtureDef: b2.Box2DFixtureDef[] = [];
		this.vertices.forEach((_, i) => {
			const fixtureDef: b2.Box2DFixtureDef = (i >= this.b2FixtureDefs.length) ?
				this.b2FixtureDefs[this.b2FixtureDefs.length - 1] :
				this.b2FixtureDefs[i];
			const shape: B2Shape = (i >= this.b2Shapes.length) ?
				this.b2Shapes[this.b2Shapes.length - 1] :
				this.b2Shapes[i];
			switch (shape) {
				case B2Shape.circle:
					fixtureDef.shape = this.box2d.createCircleShape(this.vertices[i][0][0]);
					break;
				case B2Shape.poly:
					fixtureDef.shape = this.box2d.createPolygonShape(this.getVertices(this.vertices[i]));
					break;
				case B2Shape.rect:
					fixtureDef.shape = this.box2d.createRectShape(this.vertices[i][0][0], this.vertices[i][0][1]);
					break;
				default:
					console.log(shape);
					break;
			}
			b2FixtureDef.push(
				this.box2d.createFixtureDef(fixtureDef)
			);
		});
		// b2Body設定
		this.b2Body = this.box2d.createBody(this.entity, b2BodyDef, b2FixtureDef) as b2.EBody;
	}

	private getVertices(poss: number[][]): b2.Box2DWeb.Common.Math.b2Vec2[] {
		const b2Vec2s: b2.Box2DWeb.Common.Math.b2Vec2[] = [];
		poss.forEach(v => {
			b2Vec2s.push(this.getVertex(v));
		});
		return b2Vec2s;
	}

	private getVertex(pos: number[]): b2.Box2DWeb.Common.Math.b2Vec2 {
		return this.box2d.vec2(pos[0], pos[1]);
	}
}
