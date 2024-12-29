export interface PollInfo{
    password: string, 
    username: string,
    numOfSug: number,
    numOfPart: number,
    rank1points: number,
    rank2points: number,
    rank3points: number,
    userName: string,
    checkboxAllow: boolean,
    title: string,
    checkboxAllow2: boolean
}


export interface FullPollInfo{
    password: string, 
    username: string,
    numOfSug: number,
    numOfPart: number,
    rank1points: number,
    rank2points: number,
    rank3points: number,
    userNames: string[],
    checkboxAllow: boolean,
    title: string,
    checkboxAllow2: boolean
}