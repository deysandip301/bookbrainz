/*
 * Copyright (C) 2015       Ben Ockmore
 *               2015-2016  Sean Burke
 *               2015       Ohm Patel
 *               2015       Ian Sanders
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';


function wangleID(value, idAttribute) {
	if (_.isArray(value)) {
		return value.map(
			(aValue) =>
				(_.isObject(aValue) ? aValue[idAttribute] : aValue)

		);
	}

	return _.isObject(value) ? value[idAttribute] : value;
}


class SelectWrapper extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.defaultValue) {
			this.state = {
				value: this.props.defaultValue[this.props.idAttribute] ? this.props.defaultValue :
				 this.props.options.filter((el) => el[this.props.idAttribute] === this.props.defaultValue)
			};
		}
		else {
			this.state = null;
		}
		this.currentValue = this.state.value;

		this.handleChange = this.handleChange.bind(this);
		this.getOptionLabel = this.getOptionLabel.bind(this);
		this.getOptionValue = this.getOptionValue.bind(this);
	}

	handleChange(newValue) {
		this.setState({
			value: newValue
		});

		this.currentValue = newValue;

		if (this.props.onChange) {
			this.props.onChange(wangleID(newValue, this.props.idAttribute), this.props.name);
		}
	}

	getValue() {
		const childValue = _.isNil(this.props.value) ?
			this.currentValue : this.props.value;

		return wangleID(childValue, this.props.idAttribute);
	}

	getOptionLabel(option) {
		return option[this.props.labelAttribute];
	}

	getOptionValue(option) {
		return option[this.props.idAttribute];
	}

	render() {
		const {
			base,
			groupClassName,
			label,
			labelClassName,
			multiple,
			wrapperClassName,
			...props
		} = this.props;
		const Child = base;

		const childValue = this.state.value;
		return (
			<Form.Group className={groupClassName}>
				{
					label &&
					<label className={labelClassName}>{label}</label>
				}
				<div className={wrapperClassName}>
					<Child
						{...props}
						classNamePrefix="react-select"
						getOptionLabel={this.getOptionLabel}
						getOptionValue={this.getOptionValue}
						isMulti={multiple}
						ref={(ref) => this.select = ref}
						value={childValue}
						onChange={this.handleChange}
					/>
				</div>
			</Form.Group>
		);
	}
}
SelectWrapper.displayName = 'SelectWrapper';
SelectWrapper.propTypes = {
	base: PropTypes.any.isRequired,
	defaultValue: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.object
	]),
	groupClassName: PropTypes.string,
	idAttribute: PropTypes.string.isRequired,
	label: PropTypes.string,
	labelAttribute: PropTypes.string.isRequired,
	labelClassName: PropTypes.string,
	multiple: PropTypes.bool,
	name: PropTypes.string,
	onChange: PropTypes.func,
	options: PropTypes.array,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.object
	]),
	wrapperClassName: PropTypes.string
};
SelectWrapper.defaultProps = {
	defaultValue: null,
	groupClassName: null,
	label: null,
	labelClassName: null,
	multiple: false,
	name: null,
	onChange: null,
	options: [],
	value: null,
	wrapperClassName: null
};

export default SelectWrapper;
