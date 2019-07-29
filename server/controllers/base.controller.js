'use strict';
const mongoose = require('mongoose');
const Address = require('../models/address.model');
const _ = require('lodash');

class BaseController {

	constructor(_modelRef) {
		this.modelRef = _modelRef;
		this.user = null;
	}

	async castAddress(address, update) {

		// make sure the state is the abbreviation
		if( address.state ) {
			const found = this.getStates().find((x) => x.name.toLowerCase() === address.state.toLowerCase());
			if( found ) address.state = found.abbreviation;
		} else if( !address.state && address.zip ) {
			let zip = _.cloneDeep(address.zip);
			if( zip.length > 5 ) zip = zip.substr(0, 5);
			const found = zipCodeMap.find(x => Number(x.min) <= Number(zip) && Number(x.max) >= Number(zip));
			if( found ) address.state = found.state;
		}

		if (address._id) {

			// update the address
			if (update)
				await Address.findByIdAndUpdate(address._id, address, {new: true}); // had to add await so later populate would be correct.

			address = address._id;
		} else {

			// See if we can find the address
			let foundAddr = await Address.findOne({
				address: new RegExp(address.address, 'i'),
				city: new RegExp(address.city, 'i'),
				state: new RegExp(address.state, 'i'),
				zip: address.zip
			});

			if( !foundAddr ) {
				// create the address and reference it
				const newAddress = await new Address(address).save();
				address = newAddress._id;
			} else {
				address = foundAddr._id;
			}
		}
		return address;
	}

	formatPhone(phone) {
		let s = "";
		if( phone && phone.length ) {
			if (phone.length > 10) {
				s = phone.substr(0, 1);
				phone = phone.substr(1, phone.length);
			}
			s += "(" + phone.substr(0, 3) + ") " + phone.substr(3, 3) + "-" + phone.substr(7, 4);
		}
		return s;
	}

	static replaceToObjectID(item) {
		if (typeof item === 'string' && mongoose.Types.ObjectId.isValid(item)) {
			return mongoose.Types.ObjectId(item);
		} else {
			return item;
		}
	}

	getStates() {
		return [
			{
				"name": "Alabama",
				"abbreviation": "AL"
			},
			{
				"name": "Alaska",
				"abbreviation": "AK"
			},
			{
				"name": "American Samoa",
				"abbreviation": "AS"
			},
			{
				"name": "Arizona",
				"abbreviation": "AZ"
			},
			{
				"name": "Arkansas",
				"abbreviation": "AR"
			},
			{
				"name": "California",
				"abbreviation": "CA"
			},
			{
				"name": "Colorado",
				"abbreviation": "CO"
			},
			{
				"name": "Connecticut",
				"abbreviation": "CT"
			},
			{
				"name": "Delaware",
				"abbreviation": "DE"
			},
			{
				"name": "District Of Columbia",
				"abbreviation": "DC"
			},
			{
				"name": "Federated States Of Micronesia",
				"abbreviation": "FM"
			},
			{
				"name": "Florida",
				"abbreviation": "FL"
			},
			{
				"name": "Georgia",
				"abbreviation": "GA"
			},
			{
				"name": "Guam",
				"abbreviation": "GU"
			},
			{
				"name": "Hawaii",
				"abbreviation": "HI"
			},
			{
				"name": "Idaho",
				"abbreviation": "ID"
			},
			{
				"name": "Illinois",
				"abbreviation": "IL"
			},
			{
				"name": "Indiana",
				"abbreviation": "IN"
			},
			{
				"name": "Iowa",
				"abbreviation": "IA"
			},
			{
				"name": "Kansas",
				"abbreviation": "KS"
			},
			{
				"name": "Kentucky",
				"abbreviation": "KY"
			},
			{
				"name": "Louisiana",
				"abbreviation": "LA"
			},
			{
				"name": "Maine",
				"abbreviation": "ME"
			},
			{
				"name": "Marshall Islands",
				"abbreviation": "MH"
			},
			{
				"name": "Maryland",
				"abbreviation": "MD"
			},
			{
				"name": "Massachusetts",
				"abbreviation": "MA"
			},
			{
				"name": "Michigan",
				"abbreviation": "MI"
			},
			{
				"name": "Minnesota",
				"abbreviation": "MN"
			},
			{
				"name": "Mississippi",
				"abbreviation": "MS"
			},
			{
				"name": "Missouri",
				"abbreviation": "MO"
			},
			{
				"name": "Montana",
				"abbreviation": "MT"
			},
			{
				"name": "Nebraska",
				"abbreviation": "NE"
			},
			{
				"name": "Nevada",
				"abbreviation": "NV"
			},
			{
				"name": "New Hampshire",
				"abbreviation": "NH"
			},
			{
				"name": "New Jersey",
				"abbreviation": "NJ"
			},
			{
				"name": "New Mexico",
				"abbreviation": "NM"
			},
			{
				"name": "New York",
				"abbreviation": "NY"
			},
			{
				"name": "North Carolina",
				"abbreviation": "NC"
			},
			{
				"name": "North Dakota",
				"abbreviation": "ND"
			},
			{
				"name": "Northern Mariana Islands",
				"abbreviation": "MP"
			},
			{
				"name": "Ohio",
				"abbreviation": "OH"
			},
			{
				"name": "Oklahoma",
				"abbreviation": "OK"
			},
			{
				"name": "Oregon",
				"abbreviation": "OR"
			},
			{
				"name": "Palau",
				"abbreviation": "PW"
			},
			{
				"name": "Pennsylvania",
				"abbreviation": "PA"
			},
			{
				"name": "Puerto Rico",
				"abbreviation": "PR"
			},
			{
				"name": "Rhode Island",
				"abbreviation": "RI"
			},
			{
				"name": "South Carolina",
				"abbreviation": "SC"
			},
			{
				"name": "South Dakota",
				"abbreviation": "SD"
			},
			{
				"name": "Tennessee",
				"abbreviation": "TN"
			},
			{
				"name": "Texas",
				"abbreviation": "TX"
			},
			{
				"name": "Utah",
				"abbreviation": "UT"
			},
			{
				"name": "Vermont",
				"abbreviation": "VT"
			},
			{
				"name": "Virgin Islands",
				"abbreviation": "VI"
			},
			{
				"name": "Virginia",
				"abbreviation": "VA"
			},
			{
				"name": "Washington",
				"abbreviation": "WA"
			},
			{
				"name": "West Virginia",
				"abbreviation": "WV"
			},
			{
				"name": "Wisconsin",
				"abbreviation": "WI"
			},
			{
				"name": "Wyoming",
				"abbreviation": "WY"
			}
		];
	}
}

module.exports = BaseController;