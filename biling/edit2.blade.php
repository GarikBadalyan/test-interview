<style>
    .script-editor textarea {
        font-family: monospace;
        color: #A9B7C6;
        background: #2B2B2B;
        height: 100%;
        border: none;
        padding: 0;
    }
</style>
<script>
    function delunit(unitid){
        if(confirm( _js("Вы действительно хотите удалить (переместить в архив) юнит? Юнит должен быть отключен!") )){
            document.location.href=Sjx.Ajax.getUrl('dc.units.delete', {
                unitid: unitid
            });
        }
        return false;
    }

    Ext.onReady(function (){
        @if ($template->unittype != Dc_Model_UnitTypes::BLAID_CHASSIS)
        var unitid = {{ $template->uid }};
        var untclid = null;
        var untclname = null;
        var commandPrepared = {};

        var commands = {};
        commands.gridColumns = [
            {index: 'untclid'},
            {
                h: _js('Название сценария'),
                index: 'untclname',
                type: 'string',
                dw: '100%'
            }
        ];

        commands.gridCfg = {
            baseUrl: Sjx.Ajax.getUrl('app.units-net-tasks-commands.view'),
            width: '20%',
            height: '100%',
            paging: false,
            resizable : false,
            listeners: {
                itemclick: function (button, record, item, index, e, eOpts) {

                    untclid = record.get('untclid');
                    untclname = record.get('untclname');

                    Sjx.Ajax.request({
                        url: Sjx.Ajax.getUrl('app.units-net-tasks-commands.get'),
                        params: {
                            untclid: untclid
                        },
                        loadMask: {
                            el: Ext.get('command_window'),
                            msg: _js('Загрузка...')
                        },
                        success: function (result) {
                            if (result.success) {
                                Ext.getCmp('scripttemplate').setValue(result.data.scripttemplate);
                                Sjx.Ajax.request({
                                    url: Sjx.Ajax.getUrl('app.units-net-tasks-commands.prepare'),
                                    params: {
                                        scripttemplate: result.data.scripttemplate,
                                        unitid: unitid
                                    },
                                    loadMask: {
                                        el: Ext.get('command_window'),
                                        msg: _js('Подготовка...')
                                    },
                                    success: function (result) {
                                        commandPrepared = {
                                            script: result.script,
                                            preview: result.preview
                                        };
                                        Ext.getCmp('thisscript').setValue(commandPrepared.script);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        };
        commands.grid = createGrid(commands.gridCfg, commands.gridColumns);
        var commandListId = Ext.id();
        var commandList = Ext.create('Ext.form.Panel', {
            border: true,
            collapsible: false,
            resizable : false,
            width: '20%',
            height: '100%',
            id: commandListId,
            items: [
                commands.grid
            ]
        });

        var commandPreviewId = Ext.id();
        var commandPreview = Ext.create('Ext.form.Panel', {
            title: _js('Код сценария для выполнения'),
            autoScroll: true,
            border: true,
            collapsible: false,
            resizable : false,
            width: '40%',
            height: '100%',
            layout: 'fit',
            id: commandPreviewId,
            items: [
                {
                    emptyText: _js('Код скрипта'),
                    id: 'thisscript',
                    name: 'thisscript',
                    xtype: 'textareafield',
                    border: true,
                    padding: 1,
                    grow: true,
                    border: false,
                    width: '40%',
                    height: '100%',
                    listeners: {
                        afterrender: function(cmp) {
                            cmp.getEl().set({
                                'spellcheck': 'false'
                            });
                        }
                    }
                }
            ]
        });

        var commandWindow = Ext.create('Ext.window.Window', {
            title: _js('Запуск сценариев'),
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            id: 'command_window',
            height: '70%', modal: true, width: 1278, layout: 'hbox',
            closeAction: "hide",
            buttons: [
                {
                    text: _js('Информация'),
                    handler: function () {

                        var win = new Ext.Window({
                            title: _js('Информация'),
                            autoScroll: true,
                            width: 640,
                            height: '70%',
                            preventBodyReset: true,
                            html: $('#command_info').html()
                        });
                        win.show();
                    }
                },
                {
                    text: _js('Сохранить'),
                    margin: '0 350 0 0',
                    handler: function () {

                        Sjx.Msg.confirm(
                            '',
                            _js('Сохранить этот сценарий для всех юнитов?'),
                            function (btn) {
                                if (btn == 'yes') {
                                    Sjx.Ajax.request({
                                        url: Sjx.Ajax.getUrl('app.units-net-tasks-commands.save'),
                                        params: {
                                            untclid: untclid,
                                            untclname: untclname,
                                            scripttemplate: Ext.getCmp('scripttemplate').getValue()
                                        },
                                        loadMask: {
                                            el: Ext.get('command_window'),
                                            msg: _js('Сохранение...')
                                        },
                                        success: function (result) {
                                            Sjx.Ajax.request({
                                                url: Sjx.Ajax.getUrl('app.units-net-tasks-commands.prepare'),
                                                params: {
                                                    scripttemplate: Ext.getCmp('scripttemplate').getValue(),
                                                    unitid: unitid
                                                },
                                                loadMask: {
                                                    el: Ext.get('command_window'),
                                                    msg: _js('Подготовка...')
                                                },
                                                success: function (result) {
                                                    commandPrepared = {
                                                        script: result.script,
                                                        preview: result.preview
                                                    };
                                                    Ext.getCmp('thisscript').setValue(commandPrepared.script);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                    }
                },
                {
                    text: _js('Выполнить'),
                    handler: function () {
                        Sjx.Msg.confirm(
                            '',
                            _js('Выполнить?'),
                            function (btn) {
                                if (btn == 'yes') {

                                    var loadMask = new Ext.LoadMask({
                                        msg    : _js('Выполнение...'),
                                        target : Ext.get('command_window')
                                    });
                                    loadMask.show();

                                    var untid = null;
                                    var t ={
                                        run: function () {
                                            Sjx.Ajax.request({
                                                url: Sjx.Ajax.getUrl('app.units-net-tasks-commands.run'),
                                                type: 'html',
                                                params: {
                                                    unitid: unitid,
                                                    untclid: untclid,
                                                    script: Ext.getCmp('thisscript').getValue(),
                                                    untid: untid
                                                },
                                                width: 1000,
                                                height: 600,
                                                success: function (response) {
                                                    if(response.untid) {
                                                        untid = response.untid;
                                                    }

                                                    if(response.result != null) {
                                                        Ext.TaskManager.stop(t);
                                                        loadMask.hide();

                                                        var resultWindow = Ext.create('Ext.window.Window', {
                                                            id: 'changeDtBlockWin',
                                                            title: _js('Результат выполнения'),
                                                            modal: true,

                                                            buttons: [
                                                                {
                                                                    text: _js('Закрыть'),
                                                                    action: 'close'
                                                                }
                                                            ],
                                                            items: [
                                                                {
                                                                    xtype: 'textarea',
                                                                    id: 'result',
                                                                    name: 'result',
                                                                    width: 1000,
                                                                    height: 500,
                                                                    readOnly: true
                                                                }
                                                            ]
                                                        });

                                                        resultWindow.on('show', function (cmp) {
                                                            var result = cmp.down('[name=result]');
                                                            result.setValue(response.result);
                                                        });

                                                        resultWindow.down('button[action=close]').on('click', function (btn) {
                                                            btn.up('window').close();
                                                        });

                                                        resultWindow.show();

                                                        if (response.script_result == true || response.script_error != null || response.script_update != null) {
                                                            var msg = '';
                                                            if (response.script_result == true) {
                                                                msg += _js('Сценарий вернул статус "Успешно"') + '<br >';
                                                            }
                                                            if (response.script_error != null) {
                                                                msg += _js('Сценарий вернул ошибку') + ': ' + response.script_error + '<br >';
                                                            }
                                                            if (response.script_update != null) {
                                                                msg += _js('Сценарий вернул параметры:') + '<br />';
                                                                var template = '<span style="color: Steelblue;">{0}</span>:&nbsp<span style="color: rgb(204,0,0);">{1}</span><br>';
                                                                Ext.each(response.script_update, function (item) {
                                                                    msg += Ext.String.format(template, item.name, item.value);
                                                                });
                                                            }
                                                            Sjx.Msg.alert(_js('Сценарий вернул параметры:'), msg);
                                                        }
                                                    }
                                                }
                                            });
                                        },
                                        interval: 1000 * 5
                                    };

                                    Ext.TaskManager.start(t);
                                }
                            }, {}, this
                        );
                    }
                },
                {
                    text: _js('Закрыть'),
                    handler: function () {
                        commandWindow.close();
                    }
                }],
            resizable : false,
            items: [
                commandList,
                Ext.create('Ext.form.Panel', {
                    title: _js('Оригинальный код сценария'),
                    border: true,
                    collapsible: false,
                    resizable : false,
                    width: '40%',
                    height: '100%',
                    layout: 'fit',
                    items: [
                        {
                            emptyText: _js('Код скрипта'),
                            id: 'scripttemplate',
                            name: 'scripttemplate',
                            xtype: 'textareafield',
                            cls: 'script-editor',
                            border: true,
                            padding: 1,
                            grow: true,
                            border: false,
                            width: '40%',
                            height: '100%',
                            listeners: {
                                afterrender: function(cmp) {
                                    cmp.getEl().set({
                                        'spellcheck': 'false'
                                    });
                                }
                            }
                        }
                    ]
                }),
                commandPreview
            ]
        });

        commandWindow.on('show', function(){
            commands.grid.getStore().load();
        });

        Ext.each(Ext.query('a.command'), function (span) {
            Ext.get(span).on('click', function () {
                commandWindow.show();
            });
        });
        @endif

        {{--        @if($template->unit['unittype'] == Dc_Model_UnitTypes::SERVER ||--}}
        {{--                $template->unit['unittype'] == Dc_Model_UnitTypes::BLAID_CHASSIS )--}}

        {{--            @if($template->aclIsAllowed('units_reboot') && $template->rebootAccess['reboot_right'] && !$template->unit['virtualunit'])--}}
        {{--                var btnReboot=Ext.create('Ext.Button', {--}}
        {{--                    text: _js('Перезагрузить сервер'),--}}
        {{--                    renderTo: 'reboot',--}}
        {{--                    margin: '0 0 0 0',--}}
        {{--                    handler: function (){--}}
        {{--                        document.location.href=Sjx.Ajax.getUrl('dc.units-net-tasks.unit', {--}}
        {{--                            unitid: {{ $template->uid }}--}}
        {{--                        });--}}
        {{--                        btnReboot.disable();--}}
        {{--                    }--}}
        {{--                });--}}
        {{--            @endif--}}
        {{--        @endif--}}

        @if(!$template->aclIsAllowed('sorm'))
        Ext.get('unit_history').on('click', function(){
            var win = Ext.create('App.modules.buch.views.ClientLinks.UnitHistoryWin');
            win.on('show', function (wnd){
                var store = wnd.down('UnitHistoryGrid').getStore();
                store.getProxy().setReadAction('unit-history');
                store.getProxy().setExtraParam('unitid', {{ $template->uid }});
                if(store.isFirstLoad()){
                    store.load();
                }
            });

            win.show();
        });
        @endif
    });
</script>
<table width="100%" border="1" cellspacing="0" cellpadding="0" rules="none" >
    <tr>
        <th class="menu" colspan="3">
            {{ _('Стойка') }}:
            <a class="confluence" href="{{ $template->getConfig('confluence.url') }}=27394525">
                <img src="/Images/help.png" alt="{{ _('Подробнее о ДЦ-стойках в Confluence') }}" title="Confluence">
            </a>
            @php $action = isset($_GET['action']) ? $_GET['action'] : null; @endphp
            @php $page = isset($_GET['page']) ? $_GET['page'] : null; @endphp
            @php $unitsMenuHelper = new SJX_Helper_View_UnitsMenu(); @endphp
            @php $unitsMenuHelper->render($page, $action); @endphp
            <a class="confluence" href="{{ $template->getConfig('confluence.url') }}=27394496">
                <img src="/Images/help.png" alt="{{ _('Подробнее о карточке юнита и ее редактировании в Confluence') }}" title="Confluence">
            </a>
            @if (!$template->unit['virtualunit'])
                <div style="float:right;" id="rackFastmenuContener">
                    <span id="rackmenu" class="actions" style="font-weight: normal;">{{ _('Стойки') }}</span>
                </div>
            @endif
        </th>
    </tr>
    <tr>
        <td style="padding-bottom:5px;">
            @php $template->getNotifications(); @endphp

            @php $template->printListErrors(); @endphp
            <div style="margin: 5px 6px;">@php $template->printSuccess(); @endphp</div>

            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr valign="top">
                    <td style="padding-left: 8px;" width="80%">
                        <table width="100%" cellpadding="2" cellspacing="0">
                            <tr>
                                <td width="70"><span >
                                    {{ _('Клиент') }}:</span></td>
                                <td align='left'>
                                    @if(!empty($template->unitOwner['clientid']))
                                        <a href="{{ $template->getUrlByLink('app.client.card', array('clientid' => $template->unitOwner['clientid'])) }}" >{{$template->unitOwner['clientname']}}</a>
                                    @else
                                        {{ _('Клиента нет') }}
                                    @endif
                                    @if(!$template->aclIsAllowed('sorm'))
                                        | <a id="unit_history" style="cursor: pointer;"><span class="tooltip_container" title="{{ _m('#' .
                                                "История использования юнита в различных услугах" . PHP_EOL .
                                                "и разными клиентами за все время эксплуатации" .
                                                '#') }}" >
                                {{ _('История') }}</span></a>
                                    @endif
                                </td>
                            </tr>
                            @if(isset($template->subAgreement))
                                <tr>
                                    <td><span>
                                    {{ _('Услуга') }}:</span></td>
                                    <td>
                                        @php
                                            $info = Buch_Agts_Service_SubAgreements::remainingInfo($template->subAgreement);
                                            if ($template->subAgreement['status'] == Buch_Agts_Model_vaSubAgreementsStatuses::BLOCK
                                            ) {
                                                $agreementClass = 'block1';
                                            } elseif ($template->subAgreement['status'] == Buch_Agts_Model_vaSubAgreementsStatuses::PARTIALLY_BLOCK) {
                                                $agreementClass = 'blockpart';
                                            } elseif ((bool)$template->subAgreement['testmode']) {
                                                $agreementClass = 'textmode1';
                                            } elseif ($info['type'] == Buch_Agts_Service_SubAgreements::REMAINING_TYPE_LEFT) {
                                                $agreementClass = 'full0';
                                            } else {
                                                $agreementClass = 'not1';
                                            }
                                            if($template->subAgreement['reasonattentionid']) {
                                                $agreementClass = 'attention';
                                            }
                                        @endphp
                                        <span class="{{ $agreementClass }}">
                                    {{ $template->subAgreement['fullname2'] . ', ' . $template->subAgreementStatuses[$template->subAgreement['status']] . ' ' .
                                    $template->subAgreement['aggregatedpayedfrom'] . ' - ' . $template->subAgreement['aggregatedpayedto'] . ' ' .$info['message'] }}
                                    </span>
                                    </td>
                                </tr>
                            @endif
                            @if($template->maket && !$template->aclIsAllowed('sorm'))
                                <tr>
                                    <td>{{ _('Тариф') }}:</td>
                                    <td>
                                        <a href="/index.php?page=prices&mid={{ $template->maket['maketid'] }}">{{ $template->maket['name'] }}</a></td>
                                </tr>
                            @endif
                            @if($template->unitOwner['clientid'] && $template->agreement && !$template->aclIsAllowed('sorm'))
                                <tr>
                                    <td>{{ _('Услуга') }}:</td>
                                    <td>@if($template->agreement['needtopay'])
                                            <font color="red">{{ _('Не оплачена') }}</font>
                                        @else
                                            @php
                                                $format = _('{[green]}Оплачена{[/green]} до {dtnextpay} по счету {billn}');
                                                $billLink = $template->getUrlByLink('app.bill.card', array('billid' => $template->lastPayedBill['billid']));
                                                $msg = SJX_Tool_String::format( $format, array(
                                                    '[green]'   => '<font color="green">',
                                                    '[/green]'  => '</font>',
                                                    'dtnextpay' => $template->agreement['dtnextpay'],
                                                    'billn'     => '<a href="' . $billLink . '">' . $template->lastPayedBill['billn'] . '</a>'
                                                ));
                                            @endphp
                                            {{ $msg }}
                                        @endif
                                    </td>
                                </tr>
                            @endif
                        </table>
                    </td>
                    <td align="right" style="white-space: nowrap; padding-right: 4px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr style="display: flex; flex-direction: column; align-items: flex-end">
                                @if($template->unit['unittype'] == Dc_Model_UnitTypes::SERVER ||
                                         $template->unit['unittype'] == Dc_Model_UnitTypes::BLAID_CHASSIS )
                                    @if($template->aclIsAllowed('units_reboot' ) && $template->rebootAccess['reboot_right'])
                                        <td align="right">
                                            <div id="reboot"></div>
                                        </td>
                                    @endif
                                    {{--                                    @if ($template->unittype != Dc_Model_UnitTypes::BLAID_CHASSIS && !$template->unit['virtualunit'])--}}
                                    {{--                                        <td style="width: 20px; padding-left: 15px">--}}
                                    {{--                                            <a class="command" title="{{ _('Выполнить сценарий') }}"--}}
                                    {{--                                               style="cursor: pointer">--}}
                                    {{--                                                <img src="/Images/unix-icon-1.png"--}}
                                    {{--                                                     alt="{{ _('Выполнить сценарий') }}"/>--}}
                                    {{--                                            </a>--}}
                                    {{--                                        </td>--}}
                                    {{--                                        <td width="10" align="center">&nbsp;|&nbsp;</td>--}}
                                    {{--                                    @endif--}}
                                @endif
                                @if( $template->aclIsAllowed('edit_dcunits') && (!$template->unit['archived'] || !$template->unit['virtualunit']))
                                @endif
                                @if($template->unit['unittype'] == Dc_Model_UnitTypes::SERVER || $template->unit['unittype'] == Dc_Model_UnitTypes::BLAID_CHASSIS)
                                    @if($template->aclIsAllowed('units_reboot') && $template->rebootAccess['reboot_right'] && !$template->unit['virtualunit'])
                                        <td>
                                            <script>
                                                var btnReboot = Ext.create('Ext.Button', {
                                                    text: _js('Перезагрузить сервер'),
                                                    handler: function () {
                                                        document.location.href = Sjx.Ajax.getUrl('dc.units-net-tasks.unit', {
                                                            unitid: {{ $template->uid }}
                                                        });
                                                        btnReboot.disable();
                                                    }
                                                });
                                                btnReboot.render(document.currentScript.parentNode); // Render the button next to the current script tag
                                            </script>
                                        </td>
                                        <td style="white-space: nowrap; margin-top: 5px;">
                                            <a href="{{ $template->getUrlByLink('dc.spam.index', array('unitid' => $template->uid)) }}">
                                                Отправить уведомление
                                            </a>
                                            <span width="10" align="center">&nbsp;|&nbsp;</span>
                                            <a href="#" onClick="delunit({{ $template->uid }}); return false;">
                                                Переместить юнит в архив
                                            </a>
                                        </td>

                        @endif
                        @endif
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if ($template->isNeedShowComments)
        <tr>
            <td colspan="2">
                @php $template->loadAction(array(
                                'module' => 'comments',
                                'page' => 'admin-comments',
                                'action' => 'comments',
                                'objectclass' => Comments_Model_vaAdminComments::OBJECT_CLASS_CLIENT,
                                'opt' => [ Comments_Model_vaAdminComments::STATUS_HISTORY, Comments_Model_vaAdminComments::STATUS_ACTIVE, Comments_Model_vaAdminComments::STATUS_ARCHIVE],
                                'objectid' => $template->unit['clientid'],
                                'onlylist' => true,
                                'showindcunits' => 1,
                            )); @endphp
            </td>
        </tr>
    @endif
</table>
{!! $template->fetchView('dc', 'units', $template->card); !!}
</td>
</tr>
</table>
<div id="command_info" style="display: none">
    <p>{{ _('Для сценария доступны следующие переменные') }}</p>
    <div>
        <ul>
            <li>
                <pre>${unit:id}</pre>
            </li>
            <li>
                <pre>${unit:main_ip}</pre>
            </li>
            <li>
                <pre>${unit:core_ip}</pre>
            </li>
            <li>
                <pre>${unit:ipmi_ip}</pre>
            </li>
            <li>
                <pre>${unit:ipmi_login}</pre>
            </li>
            <li>
                <pre>${unit:ipmi_passw}</pre>
            </li>
            <li>
                <pre>${unit:ips}</pre>
            </li>
            <li>
                <pre>${unit:vlan}</pre>
            </li>
            <li>
                <pre>${unit:vlan_ipmi}</pre>
            </li>
            <li>
                <pre>${dc:name}</pre>
            </li>
            <li>
                <pre>${dc:vlans}</pre>
            </li>
        </ul>
        <strong>{{ _('Uplink') }}</strong>
        <ul>
            <li>
                <pre>${uplink:login}</pre>
            </li>
            <li>
                <pre>${uplink:password}</pre>
            </li>
            <li>
                <pre>${uplink:ip}</pre>
            </li>
            <li>
                <pre>${uplink:portnum}</pre>
            </li>
            <li>
                <pre>${uplink:interface}</pre>
            </li>
        </ul>
        <strong>{{ _('Для соединения с IPMI') }}</strong>
        <ul>
            <li>
                <pre>${ipmiconn:port_name}</pre>
            </li>
            <li>
                <pre>${ipmiconn:port_num}</pre>
            </li>
        </ul>
        <strong>{{ _('Для получения параметров шлюза') }}</strong>
        <ul>
            <li>
                <pre>${gateway:login}</pre>
            </li>
            <li>
                <pre>${gateway:password}</pre>
            </li>
            <li>
                <pre>${gateway:ip}</pre>
            </li>
        </ul>
        <strong>{{ _('Клиент, к которому привязан сервер') }}</strong>
        <ul>
            <li>
                <pre>${clientid}</pre>
            </li>
        </ul>
    </div>
    <p>
        {!! _m('#' .
            "Для того что бы обновить информацию о текущем юните" . PHP_EOL .
            "из сценария необходимо вернуть в выводе строку:" . PHP_EOL .
            "<pre>unit:vlan=886#ResultCode=Update</pre>" . PHP_EOL .
            "значения переменных из такой строки обновят информацию в соотвествующих полях</p>" . PHP_EOL .
            "<p>В данный момент доступна только одна переменная: <pre>unit:vlan</pre></p>" . PHP_EOL .
            "    <p>Для того что бы вернуть из сценария сообщение об ошибке:" . PHP_EOL .
            "    <pre>текст ошибки#ResultCode=Error</pre>" .
            '#'); !!}
    </p>
</div>
