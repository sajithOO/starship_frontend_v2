import TimeImg from "../assets/tokens/TIME.svg";
import MemoImg from "../assets/tokens/MEMO.png";
import aStarshipLogo from "../components/Header/time-menu/logo.png";
function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "time") {
        return toUrl(TimeImg);
    }

    if (name === "memo") {
        return toUrl(MemoImg);
    }

    if (name === "astarship") {
        return toUrl(aStarshipLogo);
    }

    throw Error(`Token url doesn't support: ${name}`);
}