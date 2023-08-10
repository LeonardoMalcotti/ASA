
class somethingElse {
    val;

    /**
     *
     * @param {string} val
     */
    constructor(val) {
        this.val = val;
    }

    dodo(){
        this.val = "did something"
    };
}

class something {
    value;
    do_something;
    /**
     *
     * @param {somethingElse} value
     * @param {function (somethingElse) : void }do_something
     */
    constructor(value,do_something) {
        this.value = value;
        this.do_something = do_something;
    }

    do_the_do(){
        this.do_something(this.value)
    }
}

/**
 *
 * @param {somethingElse} som
 */
function ddo (som){
    som.val = "actually worked"
}

let s2 = new somethingElse("did nothing");
let s1 = new something(s2,ddo);
console.log(s1.value.val);
s1.do_the_do();

console.log(s1.value.val);



let array_of_something_else = [
    new somethingElse("not_modified"),
    new somethingElse("not_modified"),
    new somethingElse("not_modified1"),
    new somethingElse("not_modified"),
    new somethingElse("not_modified")
]

console.log(array_of_something_else);

let to_be_modified = array_of_something_else.find((e) => {
    return e.val === "not_modified1"
});

to_be_modified.val = "modified!"

console.log(array_of_something_else);