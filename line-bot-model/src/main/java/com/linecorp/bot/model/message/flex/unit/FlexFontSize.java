/*
 * Copyright 2018 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

package com.linecorp.bot.model.message.flex.unit;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum FlexFontSize {
    @JsonProperty("xxs")
    XXS("xxs"),
    @JsonProperty("xs")
    XS("xs"),
    @JsonProperty("sm")
    SM("sm"),
    @JsonProperty("md")
    Md("md"),
    @JsonProperty("lg")
    LG("lg"),
    @JsonProperty("xl")
    XL("xl"),
    @JsonProperty("xxl")
    XXL("xxl"),
    @JsonProperty("3xl")
    XXXL("3xl"),
    @JsonProperty("4xl")
    XXXXL("4xl"),
    @JsonProperty("5xl")
    XXXXXL("5xl");

    private final String propertyValue;
}
