﻿const _AccountsTable = '#accountsTable';
const _ACTION_Accounts_Index = _PREFIX + '/Accounts'
const _ACTION_Accounts_GetData = _ACTION_Accounts_Index + '/GetData'
const _ACTION_Accounts_Create = _ACTION_Accounts_Index + '/Create'
const _ACTION_Accounts_Update = _ACTION_Accounts_Index + '/Update'
const _ACTION_Accounts_Delete = _ACTION_Accounts_Index + '/Delete'
const _ACTION_Accounts_ToggleStatus = _ACTION_Accounts_Index + '/ToggleStatus'
const _ACTION_Accounts_Detail = _ACTION_Accounts_Index + '/Detail'

function AccountsIndex(isReload = false) {
    prepareSearchBar(isReload);
    prepareAccountTable();
}

function prepareSearchBar(isReload) {
    if (isReload) {
        refreshSearchBar('#searchAccounts');
    }
    prepareKeyboardAction('#searchAccounts', _AccountsTable, _ACTION_Accounts_Index);
}

function prepareAccountTable() {
    const mMouseSeletor = '#contentPager a[href], .table-custom thead th.sortable';
    refreshTableItemSort('.table-custom')
    prepareMouseAction(mMouseSeletor, _AccountsTable, _ACTION_Accounts_Index);
}

function showAccountsModal(element, isCreate = true) {
    // setup variable 
    let mModal = $('#accountsModal'),
        mIcon = mModal.find('.modal-header i'),
        mTitle = mModal.find('.modal-title'),
        mSubmit = mModal.find('.modal-submit'),
        mForm = mModal.find('form'),
        mEdtFullname = mModal.find('#Fullname'),
        mEdtUsername = mModal.find('#Username'),
        mEdtPassword = mModal.find('#Password')

    // setup modal
    let title = isCreate ? 'Create' : 'Update';
    mIcon.removeClass().addClass('mdi mdi-' + (isCreate ? 'playlist-plus' : 'playlist-edit'))
    mTitle.text(title + ' Account')
    mSubmit.text(title)

    let showUsername = document.getElementById("username-area");
    showUsername.style.display = isCreate ? 'block' : 'none';

    // setup data
    pendingFocus(mModal, mEdtFullname);
    clearFormElements(mForm);
    mEdtPassword.attr('type', 'password');
    mEdtPassword.val(generatePassword());

    // VALIDATE USERNAME
    jQuery.validator.addMethod('valid_username', function (mEdtUsername) {
        var regexUsername = /^[a-zA-Z]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
        return mEdtUsername.trim().match(regexUsername);
    });
    // VALIDATE NAME
    jQuery.validator.addMethod('valid_fullname', function (mEdtFullname) {
        var regexFullname = /^[a-zA-Z-'. ]+$/;
        return mEdtFullname.trim().match(regexFullname);
    });
    
    //VALIDATE PASWORD
    jQuery.validator.addMethod('valid_password', function (mEdtPassword) {
        var regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
        return mEdtPassword.trim().match(regexPassword);
    });

    // validate rule
    mForm.validate({
        rules: {
            Fullname: {
                required: true,
                valid_fullname:true
            },
            Username: {                
                onkeyup: false,
                required: true,
                valid_username: true,
                minlength: 6,
                maxlength: 50                          
            },
            Password: {
                required: true,
                valid_password:true
            }
        },
        messages: {
            Fullname: {
                required: 'Please enter the name',
                valid_fullname: 'Fullname is not valid'
            },
            Username: {
                required: 'Please enter the Username',
                valid_username: 'username is not valid'
            },
            Password: {
                required: 'Please enter the Password',
                valid_password: 'Password not match "/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/"'
            }
        }
    }).resetForm()


    let id = null;
    if (!isCreate) {
        let mTr = element.closest('tr');
        id = mTr.data('id');
        //mEdtUsername.val(mTr.find('.field-username').text().trim())
        mEdtFullname.val(mTr.find('.field-fullname').text().trim())
    }

    // init event
    mEdtUsername.off('focusout').on('focusout', function () {
        $(this).val($(this).val().trim())
    })
    mSubmit.off('click').on('click', function (e) {
        if (mForm.valid()) {
            let data = {
                id: id,
                model: objectifyForm(mForm)
            }
            if (isCreate) {
                AccountsCreate(mModal, data)
            } else {
                AccountsUpdate(mModal, element, data)
            }
            e.preventDefault();
            e.stopPropagation();
        } else {
            mForm.find('.form-control.error')[0].focus()
        }
    })
    mModal.modal('show');
}

function showDeleteAccountsModal(element) {
    showConfirm('Delete test',
        'Are you sure to delete this account?',
        'outline-danger',
        'delete-outline', () => AccountsDelete(element))
}

function showDetailAccount(element) {
    let id = element.closest('tr').data('id');
    let url = _ACTION_Accounts_Detail + '/' + id;
    load(url, ContentBody, url)
}

function AccountsCreate(mModal, data) {
    loadUrl(_ACTION_Accounts_Create, data => {
        if (data.success) {
            mModal.modal('hide')
            showToast(data.message, data.msgType)
            load(_ACTION_Accounts_GetData, _AccountsTable, _ACTION_Accounts_Index);
        } else {
            showToast(data.message, data.msgType)
        }
    }, null, 'POST', data)
}

function AccountsUpdate(mModal, element, data) {
    loadUrl(_ACTION_Accounts_Update, data => {
        if (data.success) {
            mModal.modal('hide')
            showToast(data.message, data.msgType)
            let tr = element.closest('tr');
            tr.find('.field-fullname').text(data.dataFullname),
                //tr.find('.field-username').text(data.dataUsername),
                tr.find('.field-password').text(data.dataPassword);

            //$('#table-data-accounts')
           
        } else {
            showToast(data.message, data.msgType)
        }
    }, null, 'POST', data)
        location.reload($this, 3000); 
}

function AccountsToggleStatus(element) {
    let mTr = element.closest('tr')
    let id = mTr.data('id');
    loadUrl(_ACTION_Accounts_ToggleStatus, data => {
        if (data.success) {
            showToast(data.message, data.msgType)
        } else {
            showToast(data.message, data.msgType)
        }
        element.prop('checked', data.data.status == 1);
        mTr.find('.field-status').text(data.data.status == 0 ? "Unlock" : "Locked")
    }, null, 'POST', { id: id })
    return false
}

function AccountsDelete(element) {
    let id = element.closest('tr').data('id');
    loadUrl(_ACTION_Accounts_Delete, data => {
        if (data.success) {
            showToast(data.message, data.msgType)
            load(_ACTION_Accounts_GetData + window.location.search, _AccountsTable, null);
        } else {
            showToast(data.message, data.msgType)
        }
    }, null, 'POST', { id: id })
}

function showPassword() {
    var x = document.getElementById("Password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
