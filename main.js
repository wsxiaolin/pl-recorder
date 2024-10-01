const Pl = require("physics-lab-web-api");

const wcwidth = require("wcwidth");

function padStringToWidth(str, width, padChar = "   ") {
  const currentWidth = wcwidth(str);
  if (currentWidth >= width) return str;

  const padLength = width - currentWidth;
  const padding = padChar.repeat(padLength);

  return str + padding;
}

async function get() {
  const user = new Pl.User(process.env.ADMIN, process.env.PASSWORD);
  await user.auth.login();
  let list = [];
  let from = "66e8d2569c503ff86ad8ae4f";
  for (let i = 1; i <= 3; i++) {
    const re = await user.messages.get(
      "66dd29d56d0dcacffea3dd53",
      "Discussion",
      100,
      from,
      i * 100
    );
    i > 1 && re.Data.Comments.shift();
    list.push(...re.Data.Comments);
    from = re.Data.Comments[re.Data.Comments.length - 1].ID;
  }

  list.reverse().forEach((comment) => {
    const matches = comment.Content.match(/@([^:]+)<\/user>/);
    console.log(
      padStringToWidth(
        comment.Nickname.replace(/[^\u4e00-\u9fff\uac00-\ud7af\w\s]/g, ""),
        15,
        " "
      ),
      ":",
      comment.Content.replace(/回复.*>: /, ""),
      matches ? "@" + matches[1] : ""
    );
  });
}

get();
