// ■テンプレート
// ・ランキング
// akashic init -t typescript-shin-ichiba-ranking
// ・マルチ
// akashic init -t typescript
// ■gの定義
// ・https://akashic-games.github.io/guide/common-pitfalls.html
// npm install -DE @akashic/akashic-engine
// ■Zipファイル(上書き)
// akashic export zip --output game.zip --nicolive -f -M
// ■テスト
// akashic sandbox
// ■マルチのテストは
// akashic serve -s nicolive
// ■"global": true を強制で付ける 場所確認：npm config list の prefix
// node_modules/@akashic/akashic-cli-scan/lib/scanUtils.jsに追加
// ・オブジェクトに global: true や、asset.global = true の追加
// ■deploy（webpage）表示変更
// ・myhtml/js/sandbox.js::resize
// 		width: (window.innerWidth || document.documentElement.clientWidth) * 0.97,
// 		height: (window.innerHeight || document.documentElement.clientHeight) * 0.97
// ■akashic-box2d game.json g.game.fpsの設定
// ・すり抜け発生を少なくするために可能な限り高く設定したい(衝突演算回数を増やす)
// ・高すぎるとスペック低い環境で動作不具合(カクツキ、フレーム落ち)起こるけど、
//   この対処法しか思いつかん
// ・とりあえず60fpsに設定

import { SceneTitle } from "./sceneTitle";


function main(param: g.GameMainParameterObject): void {
	// 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
	g.game.vars.gameState = { score: 0 };
	g.game.pushScene(new SceneTitle(param));
}

export = main;
