function AddDot(x) {
  if (x == undefined) {
    return " ";
  }
  let str = x.toString();
  let arr = str.split("");

  if (arr.length === 4) {
    arr.splice(1, 0, ".");
    let final = arr.join("");
    return final + " €";
  }
  if (arr.length === 5) {
    arr.splice(2, 0, ".");
    let final = arr.join("");
    return final + " €";
  }
  if (arr.length === 6) {
    arr.splice(3, 0, ".");
    let final = arr.join("");
    return final + " €";
  }
  if (arr.length === 7) {
    arr.splice(1, 0, ".");
    arr.splice(5, 0, ".");
    let final = arr.join("");
    return final + " €";
  }
  return x + " €";
}

function formatDate(x) {
  let y = x.split("-").reverse().join(". ");
  return y;
}

module.exports = {
  helper1: AddDot,
  helper2: formatDate
}