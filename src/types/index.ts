/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Rule } from 'stylelint';

/**
 * Carbon token information
 */
export interface CarbonToken {
  name: string;
  value: string;
  type: 'scss' | 'css-custom-prop' | 'function';
}

/**
 * Token collection by category
 */
export interface TokenCollection {
  [key: string]: CarbonToken[];
}

/**
 * Rule options shared across all rules
 */
export interface BaseRuleOptions {
  /** Properties to check */
  includeProps?: string[];
  /** Values to accept without validation */
  acceptValues?: string[];
  /** Allow undefined SCSS/CSS variables */
  acceptUndefinedVariables?: boolean;
  /** Allow Carbon CSS custom properties */
  acceptCarbonCustomProp?: boolean;
  /** Custom Carbon prefix for CSS custom properties */
  carbonPrefix?: string;
}

/**
 * Theme rule specific options
 */
export interface ThemeRuleOptions extends BaseRuleOptions {
  // Theme-specific options can be added here
}

/**
 * Layout rule specific options
 */
export interface LayoutRuleOptions extends BaseRuleOptions {
  // Layout-specific options can be added here
}

/**
 * Type rule specific options
 */
export interface TypeRuleOptions extends BaseRuleOptions {
  // Type-specific options can be added here
}

/**
 * Motion duration rule specific options
 */
export interface MotionDurationRuleOptions extends BaseRuleOptions {
  // Motion duration-specific options can be added here
}

/**
 * Motion easing rule specific options
 */
export interface MotionEasingRuleOptions extends BaseRuleOptions {
  // Motion easing-specific options can be added here
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  suggestedFix?: string;
}

/**
 * Property value to validate
 */
export interface PropertyValue {
  prop: string;
  value: string;
  index: number;
}

/**
 * Rule creator type
 */
export type RuleCreator<T extends BaseRuleOptions> = Rule<boolean, T>;
