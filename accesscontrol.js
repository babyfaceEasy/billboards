const AccessControl = require('accesscontrol');
let grantsObject = {
    super_admin: {
        board: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },//end of resource board
        user: {
            'create:any': ['*'],
            'read:any': ['*', '!id', '!password'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        board_type: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        }
    },//end of role super_admin
    board_owner: {
        board: {
            'create:any': ['*'],
            'read:own': ['*'],
            'update:own': ['*']
        },
        user: {
            'read:own': ['*'],
            'update:own': ['*'],
        },
    },//end of role board_owner
    registered_user: {
        board: {
            'read:any': ['*'],
        },
        user: {
            'read:own': ['*'],
            'update:own': ['*'],
        }
    },
    guests: {
        board: {
            'read:any': ['*']
        }
    }
}

const ac = new AccessControl(grantsObject)
module.exports = ac