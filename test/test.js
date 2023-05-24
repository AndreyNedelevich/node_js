
function logTOConsole(){
    console.log('From test/test.js');
    console.log(__dirname);
    console.log(__filename);
    console.log(process.cwd());
}

module.exports = {
    logTOConsole
}