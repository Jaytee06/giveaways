const httpError = require('http-errors');

const requireRole = function (req, res, next) {

    // super admins have access to everything
    if (req.user && req.user.roles.find(x => x.slug === 'super_admin') !== undefined)
        return next();

    // current raffle public
    if ( req.baseUrl.indexOf('/raffle/current') > -1 )
        return next();

    // // check to see if the user has permission to this url via their roles
    if( req.user && req.user.roles && req.user.roles.length > 0) {
        let found = false;

        const url = req.baseUrl.replace('/api/', '');
        req.user.roles.forEach(role => {
            if( role.permissions && role.permissions.length > 0 ) {
                const permission = role.permissions.find(x => {
                    if (x.permission.subject == url) return x
                });

                if (permission !== undefined && (
                    (permission.canRead == true && req.method == 'GET') ||
                    (permission.canCreate == true && req.method == 'POST') ||
                    (permission.canUpdate == true && req.method == 'PUT') ||
                    (permission.canDelete == true && req.method == 'DELETE')
                )) {
                    found = true;
                    return;
                }
            }
        });
        if( found ) {
            return next();
        }
    }

    const err = new httpError(401);
    return next(err);
}

module.exports = requireRole;
