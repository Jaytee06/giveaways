'use strict';
const mongoose = require('mongoose');
const Role = require('../models/role.model');

class RoleController {

    constructor() {}

    async insert(role) {

        // can't set their own slug
        if( role.slug ) {
            delete role.slug;
        }
        role.slug = role.name.trim().replace(' ', '_').toLowerCase();

        // fix role permissions castings
        if( role.permissions && role.permissions.length > 0 ) {
            role.permissions = await this._castPermissions(role.permissions);
        }

        return await new Role(role).save();
    }

    async get(query) {
        return await Role.find();
    }

    async getById(id) {
        return await Role.findById(id);
    }

    async update(id, role) {

        // can't update the slug
        if( role.slug ) {
            delete role.slug;
        }

        // fix role permissions castings
        if( role.permissions && role.permissions.length > 0 ) {
            role.permissions = await this._castPermissions(role.permissions);
        }

        return await Role.findByIdAndUpdate(id, role, {new: true});
    }

    async remove(id) {
        return await Permission.findByIdAndRemove(id);
    }

    async _castPermissions(permissions) {

        permissions.forEach(perm => {
            if( perm.permission && typeof perm.permission == "string" ) {
                perm.permission = mongoose.Types.ObjectId(perm.permission);
            }
        });

        return permissions;
    }
}

module.exports = RoleController;