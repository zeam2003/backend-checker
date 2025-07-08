import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UserDetailsDto {
  @IsString()
  valid_id: string;

  @IsString()
  glpi_currenttime: string;

  @IsNumber()
  glpi_use_mode: number;

  @IsNumber()
  glpiID: number;

  @IsString()
  glpifriendlyname: string;

  @IsString()
  glpiname: string;

  @IsString()
  glpirealname: string;

  @IsString()
  glpifirstname: string;

  @IsNumber()
  glpidefault_entity: number;

  @IsNumber()
  glpiextauth: number;

  @IsNumber()
  glpiauthtype: number;

  @IsString()
  glpiroot: string;

  @IsArray()
  @IsOptional()
  glpi_plannings: any[];

  @IsNumber()
  glpicrontimer: number;

  @IsOptional()
  glpi_tabs: any;

  @IsString()
  glpibackcreated: string;

  @IsString()
  glpicsv_delimiter: string;

  @IsString()
  glpidate_format: string;

  @IsString()
  glpidefault_requesttypes_id: string;

  @IsString()
  glpidisplay_count_on_home: string;

  @IsString()
  glpiduedatecritical_color: string;

  @IsString()
  glpiduedatecritical_less: string;

  @IsString()
  glpiduedatecritical_unit: string;

  @IsString()
  glpiduedateok_color: string;

  @IsString()
  glpiduedatewarning_color: string;

  @IsString()
  glpiduedatewarning_less: string;

  @IsString()
  glpiduedatewarning_unit: string;

  @IsString()
  glpifollowup_private: string;

  @IsString()
  glpikeep_devices_when_purging_item: string;

  @IsString()
  glpilanguage: string;

  @IsString()
  glpilist_limit: string;

  @IsString()
  glpilock_autolock_mode: string;

  @IsString()
  glpilock_directunlock_notification: string;

  @IsString()
  glpinames_format: string;

  @IsString()
  glpinotification_to_myself: string;

  @IsString()
  glpinumber_format: string;

  @IsString()
  glpipdffont: string;

  @IsString()
  glpipriority_1: string;

  @IsString()
  glpipriority_2: string;

  @IsString()
  glpipriority_3: string;

  @IsString()
  glpipriority_4: string;

  @IsString()
  glpipriority_5: string;

  @IsString()
  glpipriority_6: string;

  @IsString()
  glpirefresh_views: string;

  @IsString()
  glpiset_default_tech: string;

  @IsString()
  glpiset_default_requester: string;

  @IsString()
  glpishow_count_on_tabs: string;

  @IsString()
  glpishow_jobs_at_login: string;

  @IsString()
  glpitask_private: string;

  @IsString()
  glpitask_state: string;

  @IsString()
  glpiuse_flat_dropdowntree: string;

  @IsString()
  glpiuse_flat_dropdowntree_on_search_result: string;

  @IsString()
  glpipalette: string;

  @IsString()
  glpipage_layout: string;

  @IsString()
  glpihighcontrast_css: string;

  @IsString()
  glpidefault_dashboard_central: string;

  @IsString()
  glpidefault_dashboard_assets: string;

  @IsString()
  glpidefault_dashboard_helpdesk: string;

  @IsString()
  glpidefault_dashboard_mini_ticket: string;

  @IsNumber()
  glpidefault_central_tab: number;

  @IsNumber()
  glpifold_menu: number;

  @IsString()
  glpifold_search: string;

  @IsString()
  glpisavedsearches_pinned: string;

  @IsString()
  glpirichtext_layout: string;

  @IsString()
  glpitimeline_order: string;

  @IsString()
  glpiitil_layout: string;

  @IsString()
  glpitimeline_action_btn_layout: string;

  @IsString()
  glpitimeline_date_format: string;

  @IsArray()
  @IsOptional()
  glpi_dropdowntranslations: any[];

  @IsNumber()
  glpipluralnumber: number;

  @IsOptional()
  glpiprofiles: any;

  @IsOptional()
  glpiactiveprofile: any;
}
