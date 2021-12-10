import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";

export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://discord.gg/starshipdaofinance" target="_blank">
                <SvgIcon color="primary" component={Discord} />
            </Link>

            <Link href="https://twitter.com/StarshipDAO" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>

            <Link href="https://t.me/starship_dao" target="_blank">
                <SvgIcon viewBox="0 0 32 32" color="primary" component={Telegram} />
            </Link>
        </div>
    );
}
