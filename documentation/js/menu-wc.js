'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">opena3xx-configurator-webapp documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' : 'data-target="#xs-components-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' :
                                            'id="xs-components-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' }>
                                            <li class="link">
                                                <a href="components/AddHardwareInputTypeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddHardwareInputTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddHardwareOutputTypeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddHardwareOutputTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddHardwarePanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddHardwarePanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AutocompleteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AutocompleteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CheckboxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CheckboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsoleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConsoleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteHardwareInputDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteHardwareInputDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DynamicFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DynamicFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditHardwareInputTypeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditHardwareInputTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditHardwareOutputTypeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditHardwareOutputTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditHardwarePanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditHardwarePanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExitAppDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExitAppDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeadingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LinkHardwareInputSelectorsDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LinkHardwareInputSelectorsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LinkHardwareInputSelectorsFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LinkHardwareInputSelectorsFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageHardwareBoardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageHardwareBoardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageHardwareInputTypesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageHardwareInputTypesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageHardwareOutputTypesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageHardwareOutputTypesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageHardwarePanelsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageHardwarePanelsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageSimulatorEventsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageSimulatorEventsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapHardwareInputSelectorsDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapHardwareInputSelectorsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapHardwareInputSelectorsFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapHardwareInputSelectorsFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapHardwareOutputSelectorsDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapHardwareOutputSelectorsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapHardwareOutputSelectorsFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapHardwareOutputSelectorsFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RadiobuttonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RadiobuttonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterHardwareBoardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterHardwareBoardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SlideToggleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SlideToggleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SliderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SliderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewHardwareInputSelectorsDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ViewHardwareInputSelectorsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewHardwareOutputSelectorsDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ViewHardwareOutputSelectorsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewHardwarePanelDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ViewHardwarePanelDetailsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' : 'data-target="#xs-directives-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' :
                                        'id="xs-directives-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' }>
                                        <li class="link">
                                            <a href="directives/DynamicFieldDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">DynamicFieldDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' : 'data-target="#xs-injectables-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' :
                                        'id="xs-injectables-links-module-AppModule-a6c71ade16eff44f8f538c189c0d68dd"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigurationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConfigurationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DataService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RealTimeService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RealTimeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CoreHelper.html" data-type="entity-link">CoreHelper</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ConfigurationService.html" data-type="entity-link">ConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link">DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RealTimeService.html" data-type="entity-link">RealTimeService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddHardwarePanelDto.html" data-type="entity-link">AddHardwarePanelDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseHardwarePanelDto.html" data-type="entity-link">BaseHardwarePanelDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FieldConfig.html" data-type="entity-link">FieldConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlightEvent.html" data-type="entity-link">FlightEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareBoardDetailsDto.html" data-type="entity-link">HardwareBoardDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareBoardDto.html" data-type="entity-link">HardwareBoardDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareInputDto.html" data-type="entity-link">HardwareInputDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareInputSelectorDto.html" data-type="entity-link">HardwareInputSelectorDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareInputTypeDto.html" data-type="entity-link">HardwareInputTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareOutputDto.html" data-type="entity-link">HardwareOutputDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareOutputSelectorDto.html" data-type="entity-link">HardwareOutputSelectorDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwareOutputTypeDto.html" data-type="entity-link">HardwareOutputTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwarePanelDto.html" data-type="entity-link">HardwarePanelDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HardwarePanelOverviewDto.html" data-type="entity-link">HardwarePanelOverviewDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IntegrationType.html" data-type="entity-link">IntegrationType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOExtenderBitDto.html" data-type="entity-link">IOExtenderBitDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOExtenderBusDto.html" data-type="entity-link">IOExtenderBusDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/KeepAliveEvent.html" data-type="entity-link">KeepAliveEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapExtenderBitToHardwareInputSelectorDto.html" data-type="entity-link">MapExtenderBitToHardwareInputSelectorDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapExtenderBitToHardwareOutputSelectorDto.html" data-type="entity-link">MapExtenderBitToHardwareOutputSelectorDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OptionList.html" data-type="entity-link">OptionList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimulatorEventDto.html" data-type="entity-link">SimulatorEventDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimulatorEventItemDto.html" data-type="entity-link">SimulatorEventItemDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Validator.html" data-type="entity-link">Validator</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});