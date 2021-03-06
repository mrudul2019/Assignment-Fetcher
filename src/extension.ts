// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { deleteAssignment, fetchAssignment, saveProgress, submitProgress, switchAssignment, setOrigin, getCurrentBranch, BASE, TIMER_INTERVAL } from './gitSet';
import { compileFile, createContainer } from './Compile';
import { storeTime } from './store';
const path = require("path");

// import { Credentials } from './credentials';
const GITHUB_AUTH_PROVIDER_ID = 'github';
const SCOPES = ['repo'];
let startTime:number;
let latestTime:number;
let timerID:null|any= null;
let saveProgresstimerID:null|any= null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "assignment-fetcher" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const credentials = new Credentials();
	// await credentials.initialize(context);

	let disposable = vscode.commands.registerCommand('assignment-fetcher.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let somePathString = 'D:\\fresh';
		const definitelyPosix = somePathString.split(path.sep).join(path.posix.sep);
		vscode.window.showInformationMessage(`Hello World from Assignment_Fetcher! ${definitelyPosix}`);


	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('assignment-fetcher.fetch-assignment', async () => { 
		try{
			let Assignment = await vscode.window.showInputBox({
				prompt: 'Input the Assignment Name',
				placeHolder: 'Assignment_x'
			});
			// let pswd = await vscode.window.showInputBox({
			// 	prompt: 'Input your github password/Personal Access Token',
			// 	placeHolder: 'Password'
			// });
			
			// const session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { createIfNone: true });
			// // if(session)submitProgress(session.accessToken);
			// if(Assignment && session){
			// 	vscode.window.showInformationMessage(`Fetching....${Assignment}`);
			// 	await fetchAssignment(Assignment, session.accessToken);
			// 	vscode.window.showInformationMessage('Process Completed!');
			// }
			// else vscode.window.showInformationMessage('Did not recieve Assignment name or Password');
			if(Assignment){
				vscode.window.showInformationMessage(`Fetching....${Assignment}`);
				await fetchAssignment(Assignment);
				vscode.window.showInformationMessage('Process Completed!');
			}
		}
		catch(err){
			console.log(err);
			vscode.window.showInformationMessage('Oops something Went Wrong! : ' + err.message);
		}
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('assignment-fetcher.submit-progress', async()=>{
		try{
			console.log("submit Triggered");
			// let pswd = await vscode.window.showInputBox({
			// 	prompt: 'Input your github password/Personal Access Token',
			// 	placeHolder: 'Password'
			// });
			// if(pswd)await submitProgress(pswd);

			// const session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { clearSessionPreference: true, createIfNone: true });
			// if(session){
			// 	await submitProgress(session.accessToken);
			// 	vscode.window.showInformationMessage('Process Completed!')
			// }
			await submitProgress();
			vscode.window.showInformationMessage('Process Completed!')
		}
		catch(err){
			vscode.window.showInformationMessage('Oops something Went Wrong! : ' + err.message);
		}

	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('assignment-fetcher.switch-assignment', async()=>{
		try{
			let Assignment = await vscode.window.showInputBox({
				prompt: 'Switch to which Assignment?',
				placeHolder: 'Assignment_x'
			});
			if(Assignment){
				await switchAssignment(Assignment);
				vscode.window.showInformationMessage('Process Completed!');
			}
		}
		catch(err){
			vscode.window.showInformationMessage('Oops something Went Wrong! : ' + err.message);	
		}

	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('assignment-fetcher.delete-assignment', async()=>{
		
		try{
			let Assignment = await vscode.window.showInputBox({
				prompt: 'Delete which Assignment?',
				placeHolder: 'Assignment_x'
			});
			// let pswd = await vscode.window.showInputBox({
			// 	prompt: 'Input your github password/Personal Access Token',
			// 	placeHolder: 'Password'
			// });
			// const session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { createIfNone: true });

			// if(Assignment && session){
			// 	await deleteAssignment(Assignment, session.accessToken);
			// 	vscode.window.showInformationMessage('Process Completed!');
			// }
			if(Assignment){
				await deleteAssignment(Assignment);
				vscode.window.showInformationMessage('Process Completed!');
			}
		}
		catch(err){
			vscode.window.showInformationMessage('Oops something Went Wrong! : ' + err.message);
		}
	});
	context.subscriptions.push(disposable);

	// disposable = vscode.commands.registerCommand('assignment-fetcher.compile-assignment', async()=>{
	// 	// should this be async?
	// 	try{
	// 		// let filePath = await vscode.window.showInputBox({
	// 		// 	prompt: 'path to file to be compiled',
	// 		// 	placeHolder: './X.cpp'
	// 		// });
	// 		// vscode.workspace.workspaceFolders[0].uri.fsPath;

	// 		if(vscode.window.activeTextEditor){
	// 			let filePath = vscode.window.activeTextEditor.document.fileName;
	// 			compileFile(filePath);
	// 			vscode.window.showInformationMessage('compiled');
	// 		}
	// 	}
	// 	catch(err){
	// 		vscode.window.showInformationMessage('Oops something Went Wrong! : ' + err.message);
	// 	}
	// });
	// context.subscriptions.push(disposable);


	// disposable = vscode.commands.registerCommand('assignment-fetcher.create-container', async()=>{
	// 	// should this be async?
	// 	try{
	// 		if(BASE){
	// 			createContainer( "Assignment_Container", BASE);
	// 			console.log('command running');
	// 		}
	// 	}
	// 	catch(err){
	// 		vscode.window.showInformationMessage('Oops something Went Wrong! : ');
	// 	}
	// });
	// context.subscriptions.push(disposable);	
	
	disposable = vscode.commands.registerCommand('assignment-fetcher.compile-assignment', async()=>{
		// should this be async?
		try{
			let currentBranch = await getCurrentBranch();
			if(BASE){
				compileFile("Assignment_Container", BASE);
				if(saveProgresstimerID === null)saveProgresstimerID = setTimeout(()=>{saveProgress(); saveProgresstimerID = null;}, 5*1000);
				console.log('command running');
			}
		}
		catch(err){
			vscode.window.showInformationMessage('Oops something Went Wrong! : ');
		}
	});
	context.subscriptions.push(disposable);

	disposable = vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument)=>{
		console.log('save triggered event');
		if(BASE)compileFile("Assignment_Container", BASE);
		if(saveProgresstimerID === null)saveProgresstimerID = setTimeout(()=>{saveProgress(); saveProgresstimerID = null;}, 5*1000);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('assignment-fetcher.change-git-user', async()=>{
		try{
			// https://github.com/microsoft/vscode/issues/104080
			// let session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { clearSessionPreference: true });
			// if(!session) vscode.window.showInformationMessage('Oops something Went Wrong! : why??');
			// vscode.window.showInformationMessage(`cleared preference ${(<vscode.AuthenticationSession>session).accessToken}`);
			// session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { createIfNone: true });
			// vscode.window.showInformationMessage(`hmmm ${session.accessToken}`);
			
			let pswd = await vscode.window.showInputBox({
				prompt: 'Input your github password/Personal Access Token',
				placeHolder: 'Password'
			});
			if(pswd)setOrigin(pswd);
		}
		catch(err){
			vscode.window.showInformationMessage('Oops something Went Wrong! : ' + err);
		}
	});
	context.subscriptions.push(disposable);
	
	// The type command should also only be used for debugging or in very specific cases as it has performance problems and major limitations - https://github.com/Microsoft/vscode/issues/13441
	// https://stackoverflow.com/questions/57561242/vscode-extension-how-to-log-keystrokes

	if(BASE && TIMER_INTERVAL){
		const fswatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(BASE, '*.cpp')); 
		console.log("attaching listener");
		fswatcher.onDidChange(()=>{
			console.log('smth changed??\n');
			// vscode.window.showInformationMessage(`Timer fired for: ${TIMER_INTERVAL}`);
			if(timerID === null){
				startTime = Date.now();
				latestTime = Date.now();
				timerID = setTimeout(() => {storeTime(latestTime - startTime); timerID = null;}, <number>TIMER_INTERVAL*60*1000);
			}
			else{
				clearTimeout(timerID);
				latestTime = Date.now();
				timerID = setTimeout(() => {storeTime(latestTime - startTime); timerID = null;}, <number>TIMER_INTERVAL*60*1000);
				storeTime(latestTime - startTime);
				startTime = latestTime;
			}
		});
	}

	



	// disposable = vscode.commands.registerCommand('assignment-fetcher.getGitHubUser', async () => {
	// 	// /**
	// 	//  * Octokit (https://github.com/octokit/rest.js#readme) is a library for making REST API
	// 	//  * calls to GitHub. It provides convenient typings that can be helpful for using the API.
	// 	//  * 
	// 	//  * Documentation on GitHub's REST API can be found here: https://docs.github.com/en/rest
	// 	//  */
	// 	// const octokit = await credentials.getOctokit();
	// 	// const userInfo = await octokit.users.getAuthenticated();

	// 	// vscode.window.showInformationMessage(`Logged into GitHub as ${userInfo.data.login} `);
	// 	// console.log(`${octokit}`);
	// 	// const session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { createIfNone: true });


	// });

	// context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {
	if(timerID !== null){
		storeTime(latestTime - startTime);
		timerID = null;
	}
}
