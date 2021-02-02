import { FC } from 'react';
import {
  Card, CardBody,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { useTranslation } from '~/i18n';

import { toastSuccess, toastError } from '~/client/js/util/apiNotification';
import { useCustomizeSettingsSWR } from '~/stores/admin';

type FormValues = {
  themeType: string,
}

const isSavedStatesOfTabChangesInputName = 'isSavedStatesOfTab';
const isEnabledAttachTitleHeaderInputName = 'isEnabledAttachTitleHeader';
const pageLimitationSInputName = 'pageLimitationS';

export const CustomizeFunctionSetting:FC = () => {
  const { t } = useTranslation();
  const { data, mutate } = useCustomizeSettingsSWR();

  const {
    register, handleSubmit, control, watch,
  } = useForm({
    defaultValues: {
      [isSavedStatesOfTabChangesInputName]: data?.[isSavedStatesOfTabChangesInputName],
      [isEnabledAttachTitleHeaderInputName]: data?.[isEnabledAttachTitleHeaderInputName],
      [pageLimitationSInputName]: data?.[pageLimitationSInputName],
    },
  });

  const selectedPageLimitationS = watch(pageLimitationSInputName);


  const submitHandler: SubmitHandler<FormValues> = async(formValues) => {
    console.log(formValues);
    // const themeType = formValues[themeTypeInputName];

    try {
      // await apiv3Put('/customize-setting/theme', { themeType });
      // mutate();
      toastSuccess(t('toaster.update_successed', { target: t('admin:customize_setting.function') }));
    }
    catch (err) {
      toastError(err);
    }
  };

  return (
    <div className="row">
      <form role="form" className="col-md-12" onSubmit={handleSubmit(submitHandler)}>
        <h2 className="admin-setting-header">{t('admin:customize_setting.function')}</h2>
        <Card className="card well my-3">
          <CardBody className="px-0 py-2">
            {t('admin:customize_setting.function_desc')}
          </CardBody>
        </Card>
        <div className="form-group row">
          <div className="offset-md-3 col-md-6 text-left">
            <div className="custom-control custom-checkbox custom-checkbox-success">
              <input
                name={isSavedStatesOfTabChangesInputName}
                className="custom-control-input"
                type="checkbox"
                id="isSavedStatesOfTabChanges"
                ref={register}
              />
              <label className="custom-control-label" htmlFor="isSavedStatesOfTabChanges">
                <strong>{t('admin:customize_setting.function_options.tab_switch')}</strong>
              </label>
              <p className="form-text text-muted">
                {t('admin:customize_setting.function_options.tab_switch_desc1')}
                <br />
                {t('admin:customize_setting.function_options.tab_switch_desc2')}
              </p>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="offset-md-3 col-md-6 text-left">
            <div className="custom-control custom-checkbox custom-checkbox-success">
              <input
                name={isEnabledAttachTitleHeaderInputName}
                className="custom-control-input"
                type="checkbox"
                id="isEnabledAttachTitleHeader"
                ref={register}
              />
              <label className="custom-control-label" htmlFor="isEnabledAttachTitleHeader">
                <strong>{t('admin:customize_setting.function_options.attach_title_header')}</strong>
              </label>
              <p className="form-text text-muted">
                {t('admin:customize_setting.function_options.attach_title_header_desc')}
              </p>
            </div>
          </div>
        </div>

        <div className="form-group row">
          <div className="offset-md-3 col-md-6 text-left">
            <div className="my-0 w-100">
              <label>{t('admin:customize_setting.function_options.list_num_s')}</label>
            </div>
            <Controller
              name={pageLimitationSInputName}
              control={control}
              render={({ onChange }) => {
                return (
                  <UncontrolledDropdown>
                    <DropdownToggle className="text-right col-6" caret>
                      <span className="float-left">{selectedPageLimitationS || 20}</span>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu" role="menu">
                      {[10, 20, 50, 100].map((num) => {
                        return (
                          <DropdownItem key={num} role="presentation" onClick={() => onChange(num)}>
                            <a role="menuitem">{num}</a>
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                );
              }}
            />
            <p className="form-text text-muted">
              {t('admin:customize_setting.function_options.list_num_desc_s')}
            </p>
          </div>
        </div>

        <div className="row my-3">
          <div className="mx-auto">
            <button type="submit" className="btn btn-primary">{ t('Update') }</button>
          </div>
        </div>
      </form>
    </div>
  );
};

// class DeprecateCustomizeFunctionSetting extends Component {

//   constructor(props) {
//     super(props);

//     this.state = {
//     };
//     this.onClickSubmit = this.onClickSubmit.bind(this);
//   }

//   async onClickSubmit() {
//     const { t, adminCustomizeContainer } = this.props;

//     try {
//       await adminCustomizeContainer.updateCustomizeFunction();
//       toastSuccess(t('toaster.update_successed', { target: t('admin:customize_setting.function') }));
//     }
//     catch (err) {
//       toastError(err);
//     }
//   }

//   render() {
//     const { t, adminCustomizeContainer } = this.props;

//     return (
//       <React.Fragment>
//         <div className="row">
//           <div className="col-12">


//             <PagingSizeUncontrolledDropdown
//               label={t('admin:customize_setting.function_options.list_num_s')}
//               desc={t('admin:customize_setting.function_options.list_num_desc_s')}
//               toggleLabel={adminCustomizeContainer.state.pageLimitationS || 20}
//               dropdownItemSize={[10, 20, 50, 100]}
//               onChangeDropdownItem={adminCustomizeContainer.switchPageListLimitationS}
//             />
//             <PagingSizeUncontrolledDropdown
//               label={t('admin:customize_setting.function_options.list_num_m')}
//               desc={t('admin:customize_setting.function_options.list_num_desc_m')}
//               toggleLabel={adminCustomizeContainer.state.pageLimitationM || 10}
//               dropdownItemSize={[5, 10, 20, 50, 100]}
//               onChangeDropdownItem={adminCustomizeContainer.switchPageListLimitationM}
//             />
//             <PagingSizeUncontrolledDropdown
//               label={t('admin:customize_setting.function_options.list_num_l')}
//               desc={t('admin:customize_setting.function_options.list_num_desc_l')}
//               toggleLabel={adminCustomizeContainer.state.pageLimitationL || 50}
//               dropdownItemSize={[20, 50, 100, 200]}
//               onChangeDropdownItem={adminCustomizeContainer.switchPageListLimitationL}
//             />
//             <PagingSizeUncontrolledDropdown
//               label={t('admin:customize_setting.function_options.list_num_xl')}
//               desc={t('admin:customize_setting.function_options.list_num_desc_xl')}
//               toggleLabel={adminCustomizeContainer.state.pageLimitationXL || 20}
//               dropdownItemSize={[5, 10, 20, 50, 100]}
//               onChangeDropdownItem={adminCustomizeContainer.switchPageListLimitationXL}
//             />

//             <div className="form-group row">
//               <div className="offset-md-3 col-md-6 text-left">
//                 <CustomizeFunctionOption
//                   optionId="isEnabledStaleNotification"
//                   label={t('admin:customize_setting.function_options.stale_notification')}
//                   isChecked={adminCustomizeContainer.state.isEnabledStaleNotification}
//                   onChecked={() => { adminCustomizeContainer.switchEnableStaleNotification() }}
//                 >
//                   <p className="form-text text-muted">
//                     {t('admin:customize_setting.function_options.stale_notification_desc')}
//                   </p>
//                 </CustomizeFunctionOption>
//               </div>
//             </div>

//             <div className="form-group row">
//               <div className="offset-md-3 col-md-6 text-left">
//                 <CustomizeFunctionOption
//                   optionId="isAllReplyShown"
//                   label={t('admin:customize_setting.function_options.show_all_reply_comments')}
//                   isChecked={adminCustomizeContainer.state.isAllReplyShown || false}
//                   onChecked={() => { adminCustomizeContainer.switchIsAllReplyShown() }}
//                 >
//                   <p className="form-text text-muted">
//                     {t('admin:customize_setting.function_options.show_all_reply_comments_desc')}
//                   </p>
//                 </CustomizeFunctionOption>
//               </div>
//             </div>

//             <AdminUpdateButtonRow onClick={this.onClickSubmit} disabled={adminCustomizeContainer.state.retrieveError != null} />
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }

// }
