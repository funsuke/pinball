import tl = require("@akashic-extension/akashic-timeline");
import { SceneGame } from "./sceneGame";

// GBの解像度 160 x 144
// height を 720 にする(5倍に拡大して表示する)
// → 800 x 720
const GB = {
	width: 800,
	height: 720,
};

const PADDING_X: number = (g.game.width - GB.width) / 2;

// *************************************************
// タイトルシーン
// *************************************************
export class SceneTitle extends g.Scene {
	constructor(param: g.GameMainParameterObject) {
		super({ game: g.game });
		// 読込時処理
		this.onLoad.add(() => {
			this._Load(param);
		});
	}

	private _Load(param: g.GameMainParameterObject): void {
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
		// レイヤー
		// -------------------------------------------------------------
		const layer2 = new g.E({
			scene: this, parent: this,
		});
		const layer1 = new g.E({
			scene: this, parent: this,
		});
		// -------------------------------------------------------------
		// レイヤー１
		// -------------------------------------------------------------
		// Background
		new g.FilledRect({
			scene: this,
			cssColor: "rgb(156,185,22)",
			width: GB.width, height: 720,
			x: PADDING_X, y: 0,
			parent: layer1,
		});
		new g.FilledRect({
			scene: this,
			cssColor: "rgb(48,100,48)",
			width: 800, height: 15,
			x: PADDING_X, y: 0,
			opacity: 0.3,
			parent: layer1,
		});
		new g.FilledRect({
			scene: this,
			cssColor: "rgb(48,100,48)",
			width: 15, height: g.game.height - 15,
			x: PADDING_X, y: 15,
			opacity: 0.3,
			parent: layer1,
		});
		// 例のロゴ
		const customer = new g.Sprite({
			scene: this,
			src: this.asset.getImageById("customer"),
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width / 2, y: -50,
			parent: layer1,
		});
		new tl.Timeline(this).create(customer)
			.moveTo(g.game.width / 2, g.game.height / 2, 3000)
			.call(() => {
				this.asset.getAudioById("nc42113").play();
			}).wait(1000).call(() => {
				layer1.hide();
				layer2.show();
				this.asset.getAudioById("nc362622").play().changeVolume(0.6);
				this.onPointDownCapture.add((ev: g.PointDownEvent) => {
					g.game.pushScene(new SceneGame(param));
				});
			});
		// -------------------------------------------------------------
		// レイヤー２
		// -------------------------------------------------------------
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("title"),
			x: PADDING_X, y: 0,
			parent: layer2,
		});
		new g.FilledRect({
			scene: this,
			cssColor: "rgb(48,100,48)",
			width: 800, height: 15,
			x: PADDING_X, y: 0,
			opacity: 0.3,
			parent: layer2,
		});
		new g.FilledRect({
			scene: this,
			cssColor: "rgb(48,100,48)",
			width: 15, height: g.game.height - 15,
			x: PADDING_X, y: 15,
			opacity: 0.3,
			parent: layer2,
		});
		return;
	}
}
