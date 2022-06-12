var fs = require("fs");
var path = require("path");

var NOT_IN = [
  "assets",
  ".DS_Store",
  ".nojekyll",
  "_sidebar.md",
  "index.html",
  "README.md",
];

var docsPath = "./docs";
var sidebarPath = path.join(docsPath, "_sidebar.md");

function getFileList(dir) {
  var arr = fs.readdirSync(dir);
  var list = [];
  arr.forEach(function (item) {
    if (!NOT_IN.includes(item)) {
      var fullpath = path.join(dir, item);
      var stats = fs.statSync(fullpath);
      if (stats.isDirectory()) {
        var obj = {
          name: item,
          files: getFileList(fullpath),
          type: "dir",
        };
        list.push(obj);
      } else {
        var obj = {
          name: item.split(".")[0],
          paths: fullpath.split("/").splice(1).join("/"),
          type: "file",
        };
        list.push(obj);
      }
    }
  });
  return list;
}

function getFileContent(files, deep = 0) {
  let content = "";
  files.forEach(function (file) {
    if (file.type === "dir") {
      content += `\n${"  ".repeat(deep)}- ${file.name}\n`;
      content += getFileContent(file.files, deep + 1);
    } else {
      content += `${"  ".repeat(deep)}- [${file.name}](${file.paths})\n`;
    }
  });
  return content;
}

function setSidebar(content) {
  fs.writeFile(sidebarPath, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("sidebar.md has been saved!");
  });
}

var list = getFileList(docsPath);
var content = getFileContent(list);
setSidebar(content);

console.log("\x1B[46m", "docs目录已更新", "\x1B[0m", list.length, "个文件");
