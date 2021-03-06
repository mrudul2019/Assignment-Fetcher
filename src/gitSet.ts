import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';
import * as vscode from 'vscode';
// const BASE = '/home/mrudulmnair/Desktop/Lab/0026G';
export const BASE:(string|undefined) = vscode.workspace.getConfiguration().get('Local Repository Path');
export const TIMER_INTERVAL:number|undefined = vscode.workspace.getConfiguration().get('Timer Shutdown Interval');

const options: Partial<SimpleGitOptions> = {
    baseDir: BASE,
    binary: 'git',
    maxConcurrentProcesses: 6,
 };
const git: SimpleGit = simpleGit(options);
// const git: SimpleGit = simpleGit();

const USER = vscode.workspace.getConfiguration().get('Github Username');
const REPONAME = vscode.workspace.getConfiguration().get('Submission Repository Name');

export async function fetchAssignment(name:string) {
    
    // const remote = `https://${USER}:${pswd}@github.com/${USER}/${REPONAME}`;
    try{
        await makeBranch(name);
        await updateBranch(name);
        // await pushBranch(name, remote);
        await pushBranch(name);
    }
    catch(err){
        throw(err);
    }
}

export async function submitProgress(){
    // const remote = `https://${USER}:${pswd}@github.com/${USER}/${REPONAME}`;
    try{
        // let branchName = await git.branch(['--show-current']);
        let branches = await git.branchLocal();
        // await git.push(remote, branches.current, ['-u']);
        await git.push( ['origin', branches.current,'-u']);
        console.log("submitted");

    }
    catch(err){
        throw(err);
    }
}
export async function saveProgress(){
    try{
        await git.add('*').commit('SavingProgress');
        vscode.window.showInformationMessage('progress saved');
        
    }
    catch(err){
        vscode.window.showInformationMessage('Couldn\'t save progress');
        throw(err);
    }
}
export async function switchAssignment(name: string){
    try{
        await git.checkout(name);
        vscode.window.showInformationMessage('switched to a branch');
    }
    catch(err){
        vscode.window.showInformationMessage('Couldn\'t switch to a branch');
        throw(err);
    }
}
export async function deleteAssignment(name: string){
    // const remote = `https://${USER}:${pswd}@github.com/${USER}/${REPONAME}`;
    try{
        // await git.push(remote, name, ['--delete']);
        await switchAssignment("main");
        await git.deleteLocalBranch(name, true);
        await git.push('origin', name, ['--delete']);
        vscode.window.showInformationMessage('deleted remote and local branch ');
        
    }
    catch(err){
        vscode.window.showInformationMessage('Couldn\'t delete');
        throw(err);
    }
}
export async function setOrigin(pswd:string){
    const remote = `https://${USER}:${pswd}@github.com/${USER}/${REPONAME}`;
    try{
        await git.remote(['set-url', 'origin', remote]);
        vscode.window.showInformationMessage('origin changed successfully ');
        
    }
    catch(err){
        vscode.window.showInformationMessage('Couldn\'t set Origin');
        throw(err);
    }
}
export async function getCurrentBranch() {
    try{
        let branches = await git.branchLocal();
        return  branches.current;
    }
    catch(err){
        vscode.window.showInformationMessage('Couldn\'t get current branch');
        throw(err);
    }
}


async function makeBranch(name:string) {
    try{
        console.log(`fetching for ${name}??`);
        await git.checkout("main");
        await git.checkout(['-b', name]);
    }
    catch(err){
        // try{
        //     await git.deleteLocalBranch(name, true);
        // }
        // catch(err){ 
        //     throw(err);
        // } 
        throw(err);
    }
}
async function updateBranch(name:string) {
    let LabRepo:(string|undefined) = vscode.workspace.getConfiguration().get('Lab Repository');
    try{
        await git.pull(LabRepo, name, ['--allow-unrelated-histories']);
        console.log('updated');
    }
    catch(err){
        throw(err);
    }
}
async function pushBranch(name:string) {
    let LabRepo:(string|undefined) = vscode.workspace.getConfiguration().get('Lab Repository');
    try{
        // await git.push(remote, name, ['-u']);
        await git.push(['origin', name, '-u']);
        console.log('Successfully made branch in Assignment repo');
    }
    catch(err){
        console.log('error while pulling branch');
        await git.checkout("main");
        console.log('deleting bad branch');
        await git.deleteLocalBranch(name, true);
        throw(err);
    }
}

module.exports = 
{fetchAssignment, saveProgress, submitProgress, switchAssignment, deleteAssignment, setOrigin, getCurrentBranch, BASE, TIMER_INTERVAL};