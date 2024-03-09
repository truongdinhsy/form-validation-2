



var registerForm = new validator('#form-1',);
registerForm.onSubmit = function (data) {
    console.log(data);
}

function validator(formSelecttor) {

    var _this = this


    var diacriticsRegex = /[ăằắặẵâầẫậêếềệễơớờợỡưứừựữùúụũàáâãäåæçèéêëìíîịïðñòóôõöøùúûüýÿỵỳ]/;

    var VH = /[A-Z]/




    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement

            }
            element = element.parentElement

        }

    }


    var formrules = {};


    /**
     * - Nếu có lỗi thì returrn messageError
     * - Không có lỗi thì return undefined 
     * 
     */
    var validatorRules = {


        required: function (value) {


            return value ? undefined : `vui lòng nhập  `;

        },

        name: function (value) {
            if (!value) {
                return 'Vui lòng nhập tên'
            }
            return value.length >= 6 ? undefined : ' tên Quá ngắn  ';

        },
        email: function (value) {
            var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!value) {
                return 'Vui lòng nhập Email'
            }
            if (!regexEmail.test(value) || diacriticsRegex.test(value)) {
                return 'Email không đúng ';
            }
            return undefined;

        },
        password: function (value) {

            if (!value) {
                return 'Hãy nhập mật khẩu '
            }
            if (value.length < 8) {
                return `Vui lòng nhập ít nhất 8 ký tự`
            }
            if (!VH.test(value)) {
                return 'Mật khẩu Phải có ít nhất một chữ cái viết hoa'
            }
            if (!/\d/.test(value)) {
                return 'Mật khẩu Phải có ít nhất một chữ số'
            }
            if (diacriticsRegex.test(value)) {
                return 'Mật khẩu không được có dấu'
            }
            return value ? undefined : ' vui lòng nhập mật khẩu ';
        },

        requiredConfirm: function (value) {


            if (!value) {
                return 'hãy nhập mât khẩu trước '
            }
            return document.querySelector('#form-1 #password').value === value ? undefined : 'mật khẩu không khớp'

        },








    }




    // lây ra formElement trong DOM theo formSelecttor
    var formElement = document.querySelector(formSelecttor);



    // Chỉ sử lý khi lấy được formelement
    if (formElement) {

        var inputs = formElement.querySelectorAll('[name][rules]');// lấy ra tất cả các tên và rules
        for (var input of inputs) { // lặp rules để lấy ra thành phần 
            var rules = input.getAttribute('rules').split('|'); // lấy thành phần trong rules rồi tách ra mảng thông qua split()
            for (var rule of rules) { // lặp để lấy các thành  phần trong rules đã tách

                // var ruleinfo;


                // var ruleHasvalue = rule.includes(':');  // gán ruleHasvalue bằng  những nules nào có đấu ':'
                // if (ruleHasvalue) { // check 

                //     ruleinfo = rule.split(':');// tách đẫu ':'
                //     rule = ruleinfo[0]; // lấy ra rule ruleinfo là min 
                // }
                var ruleFunc = validatorRules[rule]; // gán ruleFunc bằng thành phần 
                // if (ruleHasvalue) {// check 

                //     ruleFunc = ruleFunc(ruleinfo[1]) // gán ruleFunc =  ruleinfo[1] tức gán min =  8
                // }

                if (Array.isArray(formrules[input.name])) { // check bó phải mảng hay không 

                    formrules[input.name].push(ruleFunc); // truyền rules đã tách vào mảng formrules[input.name]

                } else {

                    formrules[input.name] = [ruleFunc];// nếu không phải mảng thì gán  formrules[input.name] thành  mảng chứa [validatorRules[rule]]
                }



            }


            input.onblur = handleValidate;
            input.oninput = handleClear;


        }
        //bắt sự kiên bằng onblur
        function handleValidate(event) {


            var rules = formrules[event.target.name];
            var errorMessage;


            rules.some(function (rule) {// kiểm tra giá trị nếu không có giá trị nhập vào thì some sẽ trả về true còn có giá trị thì trả vè false
                errorMessage = rule(event.target.value);// lấy giá trị của input
                return errorMessage;
            })
            var formgroup;
            if (errorMessage) { //có lỗi
                formgroup = getParent(event.target, '.form-group');// lấy ra form-group
                if (formgroup) {
                    formgroup.classList.add('invalid'); // gán cho form-group thêm một class invalid
                    var formMessage = formgroup.querySelector('.form-message');// lấy ra form-Message
                    if (formMessage) {
                        formMessage.innerText = errorMessage; // gán lỗi 
                    }
                }


            }
            return !errorMessage




        };

        // clear message lỗi bằng oninput
        function handleClear(event) {
            var formgroup = getParent(event.target, '.form-group');
            if (formgroup.classList.contains('invalid')) {
                formgroup.classList.remove('invalid');// gỡ class
                var formMessage = formgroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = ''; // gán bằng rỗng
                }
            }



        }


        // sử lý formSubmit
        formElement.onsubmit = function (event) {
            event.preventDefault();
            var inputs = formElement.querySelectorAll('[name][rules]');// lấy ra tất cả các tên và rules
            var isValid = true;
            for (var input of inputs) {// lặp rules để lấy ra thành phần 
                if (!handleValidate({ target: input })) {
                    isValid = false;
                }

            }

            // khi không có lỗi thì submit form 
            if (isValid) {


                if (typeof _this.onSubmit === 'function') {


                    var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
                    var inputValues = Array.from(enableInput).reduce(function (values, input) {

                        switch (input.type) {
                            case ' radio':
                                values[input.name] = formElement.querySelector('input.name["' + input.name + '"]:checked').value;
                                break
                            case 'checkbosx':
                                if (!input.matches(':checked')) {
                                    values[input.name] = "";
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;

                            case 'file':
                                values[input.name] = input.file
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    // gọi lại hàm onSubmit() và trả về giá trị 
                    _this.onSubmit(inputValues);

                }
                else {
                    formElement.submit();
                }
            }

        }

        //console.log()

    }
}