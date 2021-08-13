import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for easy-online import models
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const EASY_ONLINE_IMPORT = new ResourceType('easyonlineimport');

