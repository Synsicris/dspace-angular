import { ResourceType } from '../../../core/shared/resource-type';

/**
 * The resource type for Group
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const SUBSCRIPTION = new ResourceType('subscription');
