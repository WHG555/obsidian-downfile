import { App, Modal, Notice, Plugin, PluginSettingTab, PluginManifest,Setting, FileSystemAdapter,request } from 'obsidian';
import {GetGiteePluginList,GetGiteePluginHistory,GetGiteeThemeList,GetGiteeSnippetList} from 'downloadfile';
import PluShow from './ui/PluShow.svelte';
import Themes from './ui/Themes.svelte';
import CSSView from './ui/CSSView.svelte';

// import {SuggesterItem} from './wconfig.ts'

// interface SuggesterItem {
//     display: string,        // displayed to user
//     info: any               // supplmental info for the callback
// }
// 接口
interface MyPluginSettings {
	mySetting: string;
}
// 插件默认设置
const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}
// 插件主要功能
export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	thememodel:ThemesModal;
	pluginmodel:SampleModal;
	cssmodel:CSSModal;
	pluinfo: JSON;
	pluhistory: JSON;
	thisplulist: [];

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.thisplulist = [];
	}

	// 插件重载
	async onload() {
		console.log('loading plugin');

		await this.loadSettings();
		this.thememodel = new ThemesModal(this.app);
		this.cssmodel = new CSSModal(this.app);
		this.pluginmodel = new SampleModal(this.app);

		this.addCommand({
			id: 'open-sample-modal',
			name: 'Open Sample Modal',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						// new SampleModal(this.app, this.thisplulist, this).open();
						// this.cssmodel.open();
						this.pluginmodel.open();
					}
					return true;
				}
				return false;
			}
		});
		// 界面---设置界面
		this.addSettingTab(new SampleSettingTab(this.app, this));
		// 编辑界面
		// this.registerCodeMirror((cm: CodeMirror.Editor) => {
		// 	console.log('codemirror', cm);
		// });
	}

	onunload() {
		console.log('unloading plugin');
	}
	// 导入配置
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	// 保存配置
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
// 主题的界面
class ThemesModal extends Modal {
	view:Themes;

	constructor(app: App) {
		super(app);
	}

	async getNowTheme() {
		let configdir = this.app.vault.configDir
		let libpath = (await this.app.vault.adapter.list(configdir + '//themes')).files
		
		return libpath
	}

	async onOpen() {
		const themelist = await GetGiteeThemeList()
		let nowthemelist = await this.getNowTheme();

		// console.log('theme', themelist)

		let {contentEl} = this;
		this.view = new Themes({
			target: contentEl,
			props: {  
				themelist:themelist,
				nowthemelist: nowthemelist,
				bashpath: this.app.vault.adapter.basePath;
				name: 'test',
			}
		});
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}
// CSS样式的界面
class CSSModal extends Modal {
	view: CSSView

	constructor(app: App) {
		super(app);
	}

	async getNowTheme() {
		let configdir = this.app.vault.configDir
		let libpath = (await this.app.vault.adapter.list(configdir + '//snippets')).files
		
		return libpath
	}

	async onOpen() {
		let snippetlist = await GetGiteeSnippetList();
		let nowsnilist = await this.getNowTheme();
		// console.log('css', snippetlist)
		let {contentEl} = this;
		this.view = new CSSView({
			target: contentEl,
			props: {  
				name:'css',
				snippetlist: snippetlist,
				bashpath: this.app.vault.adapter.basePath;
				nowsnilist: nowsnilist,
			}
		});
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

// 插件的界面
class SampleModal extends Modal {
	private view: PluShow;
	nowpluinfo: [];
	app:App;

	constructor(app: App) {
		super(app);
		this.app  = app;
	}
	
	async get_plu_list() {
		let configdir = this.app.vault.configDir
		let libpath = (await this.app.vault.adapter.list(configdir + '//plugins')).folders
		this.nowpluinfo = []
		for (let i in libpath) {
			// 获取所有插件版本信息
			if (await this.app.vault.adapter.exists(libpath[i] + '\\manifest.json', true)) {
                let filedata = (await this.app.vault.adapter.read(libpath[i] + '\\manifest.json'));
                let tmp = JSON.parse(filedata);
                this.nowpluinfo.push(tmp)
            }
		}		
		return this.nowpluinfo
	}

	async onOpen() {
		// let {contentEl} = this;
		// contentEl.setText('Woah!');
		const pluginlist = await GetGiteePluginList();
		// console.log(pluginlist)
    	const pluginhistory = await GetGiteePluginHistory();
    	// console.log(pluginhistory, typeof pluginhistory)
		await this.get_plu_list();

		let { contentEl } = this;
		this.view = new PluShow({
			target: contentEl,
			props: {  
				plulist : pluginlist,	// 所有插件的信息
				pluhistory : pluginhistory, 
				nowpluinfo: this.nowpluinfo,  // 当前有的插件
				bashpath: this.app.vault.adapter.basePath;
			}
		});
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: '资源库'});

		// new Setting(containerEl)
		// 	.setName('Setting #1')
		// 	.setDesc('It\'s a secret')
		// 	.addText(text => text
		// 		.setPlaceholder('Enter your secret')
		// 		.setValue('')
		// 		.onChange(async (value) => {
		// 			console.log('Secret: ' + value);
		// 			this.plugin.settings.mySetting = value;
		// 			await this.plugin.saveSettings();
		// 		}));
		new Setting(containerEl)
			.setName("插件市场")
			.setDesc("国内下载插件的地方")
			.addButton(cb => {
				cb.setButtonText("插件库");
				cb.setCta();
				cb.onClick(() => {
					this.plugin.pluginmodel.open();
				})
			})
		new Setting(containerEl)
			.setName("主题市场")
			.setDesc("下载各种主题的地方")
			.addButton(cb => {
				cb.setButtonText("主题库");
				cb.setCta();
				cb.onClick(() => {
					this.plugin.thememodel.open();
				})
			})
		new Setting(containerEl)
			.setName("CSS市场")
			.setDesc("分享各种样式的CSS")
			.addButton(cb => {
				cb.setButtonText("CSS库");
				cb.setCta();
				cb.onClick(() => {
					this.plugin.cssmodel.open();
				})
			})
	}
}
