
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


class Father {
    val;

    /**
     *
     * @param {string} v
     */
    constructor(v) {
        this.val = v;
    }
}

class Child extends Father {
    n_v;

    /**
     *
     * @param {string} v
     * @param {string} n_v
     */
    constructor(v, n_v) {
        super(v);
        this.n_v = n_v;
    }
}

class OtherChild extends Father {
    n_v;

    /**
     *
     * @param {string} v
     * @param {string} n_v
     */
    constructor(v, n_v) {
        super(v);
        this.n_v = n_v;
    }
}


let vvv = new Child("father_value", "child_value");

/**
 *
 * @param {Father} v
 */
function inst(v){
    console.log(v instanceof OtherChild);
}

inst(vvv)