openerp.webclient_proxy_action = function (instance) {
    instance.web.ActionManager.include({
        ir_actions_act_proxy: function (action, options) {
            action.action_list.forEach(function (task) {
                $.ajax({
                    url: task['url'],
                    type: 'POST',
                    data: JSON.stringify(task['params']),
                    contentType: 'application/json',
                }).done(function (result) {
                    console.log("Proxy action have been done with sucess", result);
                    //TODO add an UI feedback
                    //TODO Give the possibility to call a server callBack
                }).fail(function (result) {
                    console.log('Proxy action have failed', result);
                    //TODO add an UI feedback
                    //TODO Give the possibility to call a server callBack
                })
            })
        }
    })
};
