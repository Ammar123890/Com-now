define({ "api": [
  {
    "type": "POST",
    "url": "/user/call",
    "title": "Call a user",
    "name": "Call_a_user",
    "group": "Call",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>recipient user id</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/call.js",
    "groupTitle": "Call"
  },
  {
    "type": "PATCH",
    "url": "/user/call/status",
    "title": "Call status change",
    "name": "Call_status_change",
    "group": "Call",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>Id of the user who called you</p>"
          },
          {
            "group": "body",
            "type": "String",
            "allowedValues": [
              "\"accepted\"",
              "\"rejected\""
            ],
            "optional": false,
            "field": "status",
            "description": "<p>status of the call</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/call.js",
    "groupTitle": "Call"
  },
  {
    "type": "PATCH",
    "url": "/user/predefinedmessage/order",
    "title": "Change order of predefined message",
    "name": "Change_order_of_predefined_message",
    "group": "Predefined_Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "Object[]",
            "optional": false,
            "field": "orders",
            "description": "<p>Array of templates order</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "orders[message]",
            "description": "<p>Id of the message template</p>"
          },
          {
            "group": "body",
            "type": "Number",
            "optional": false,
            "field": "orders[rank]",
            "description": "<p>Rank of the message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/predefinedMessage.js",
    "groupTitle": "Predefined_Message"
  },
  {
    "type": "POST",
    "url": "/user/predefinedmessage",
    "title": "Create new predefined message",
    "name": "Create_new_predefined_message",
    "group": "Predefined_Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>Message Text</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/predefinedMessage.js",
    "groupTitle": "Predefined_Message"
  },
  {
    "type": "DELETE",
    "url": "/user/predefinedmessage",
    "title": "Delete predefined message",
    "name": "Delete_predefined_message",
    "group": "Predefined_Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "predefinedMessage",
            "description": "<p>Message mongodb id</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/predefinedMessage.js",
    "groupTitle": "Predefined_Message"
  },
  {
    "type": "PATCH",
    "url": "/user/predefinedmessage",
    "title": "Edit predefined message",
    "name": "Edit_predefined_message",
    "group": "Predefined_Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "predefinedMessage",
            "description": "<p>Message mongodb id</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>Message text</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/predefinedMessage.js",
    "groupTitle": "Predefined_Message"
  },
  {
    "type": "GET",
    "url": "/user/predefinedmessage",
    "title": "Get predefined message",
    "name": "Get_predefined_message",
    "group": "Predefined_Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/predefinedMessage.js",
    "groupTitle": "Predefined_Message"
  },
  {
    "type": "POST",
    "url": "/user/team",
    "title": "Create new team",
    "name": "Create_new_team",
    "group": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Team's name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/team.js",
    "groupTitle": "Team"
  },
  {
    "type": "PATCH",
    "url": "/user/team",
    "title": "Edit team",
    "name": "Edit_team",
    "group": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Team's name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/team.js",
    "groupTitle": "Team"
  },
  {
    "type": "POST",
    "url": "/user/team/online-users",
    "title": "Get all online users",
    "name": "Get_all_online_users",
    "group": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/team.js",
    "groupTitle": "Team"
  },
  {
    "type": "POST",
    "url": "/user/team-member",
    "title": "Add team member",
    "name": "Add_team_member",
    "group": "Team_Member",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "fullName",
            "description": "<p>Team member's name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/teamMember.js",
    "groupTitle": "Team_Member"
  },
  {
    "type": "PATCH",
    "url": "/user/team-member/status",
    "title": "Change team member status",
    "name": "Change_team_member_status",
    "group": "Team_Member",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "teamMember",
            "description": "<p>id of the member</p>"
          },
          {
            "group": "body",
            "type": "String",
            "allowedValues": [
              "\"blocked\"",
              "\"unblocked\""
            ],
            "optional": false,
            "field": "status",
            "description": "<p>Status to change</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/teamMember.js",
    "groupTitle": "Team_Member"
  },
  {
    "type": "DELETE",
    "url": "/user/team-member",
    "title": "Delete team member",
    "name": "Delete_team_member",
    "group": "Team_Member",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "String",
            "optional": false,
            "field": "teamMember",
            "description": "<p>id of the member</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/teamMember.js",
    "groupTitle": "Team_Member"
  },
  {
    "type": "GET",
    "url": "/user/team-member",
    "title": "Get all team members",
    "name": "Get_all_team_members",
    "group": "Team_Member",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "String",
            "allowedValues": [
              "\"blocked\"",
              "\"unblocked\"",
              "\"all\""
            ],
            "optional": true,
            "field": "status",
            "defaultValue": "all",
            "description": "<p>Filter by status</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/teamMember.js",
    "groupTitle": "Team_Member"
  },
  {
    "type": "DELETE",
    "url": "/user/team-member/leave",
    "title": "Leave team member",
    "name": "Leave_team_member",
    "group": "Team_Member",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/teamMember.js",
    "groupTitle": "Team_Member"
  },
  {
    "type": "PATCH",
    "url": "/user/order",
    "title": "Change order of users",
    "name": "Change_order_of_users",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "Object[]",
            "optional": false,
            "field": "orders",
            "description": "<p>Array of templates users</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "orders[user]",
            "description": "<p>Id of the user</p>"
          },
          {
            "group": "body",
            "type": "Number",
            "optional": false,
            "field": "orders[rank]",
            "description": "<p>Rank of the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "PUT",
    "url": "/user/change-password",
    "title": "Change password",
    "name": "Change_password",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "currentPassword",
            "description": "<p>user's current password</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>user's new password</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/subscription",
    "title": "Change subscription status",
    "name": "Change_subscription_status",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "Boolean",
            "optional": false,
            "field": "isSubscribed",
            "description": "<p>true or false</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Code of the subscription, required when isSubscribed is true</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "expiry",
            "description": "<p>subscription expiry time</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "DELETE",
    "url": "/user",
    "title": "Delete user account",
    "name": "Delete_user_account",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "String",
            "optional": true,
            "field": "lang",
            "defaultValue": "en",
            "description": "<p>Can be en or de</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "PUT",
    "url": "/user/profile",
    "title": "Edit profile",
    "name": "Edit_profile",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "fullName",
            "description": "<p>user's fullName</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/user/message",
    "title": "Fetch Message",
    "name": "Fetch_Message",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/message.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/user/subscription",
    "title": "Get all subscriptions",
    "name": "Get_all_subscriptions",
    "group": "User",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "String",
            "optional": true,
            "field": "lang",
            "defaultValue": "en",
            "description": "<p>Can be en or de</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/login",
    "title": "Login user",
    "name": "Login_User",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>user's email, required when user type is doctor</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>user's password, required when user type is doctor</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "enrollmentCode",
            "description": "<p>user's enrollment code, required when user type is team member</p>"
          },
          {
            "group": "body",
            "type": "String",
            "allowedValues": [
              "\"doctor\"",
              "\"team-member\""
            ],
            "optional": false,
            "field": "userType",
            "description": "<p>user type</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/logout",
    "title": "Logout user",
    "name": "Logout_user",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/verify-code",
    "title": "Password recovery code verification",
    "name": "Password_Recovery_Code_Verification",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>verification code</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/register",
    "title": "Register user",
    "name": "Register_User",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>user's password</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "fullName",
            "description": "<p>user's fullname</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/reset-password",
    "title": "Reset password after OTP verification",
    "name": "Reset_password_after_OTP_verification",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>user's new password</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/fcm-token",
    "title": "Save FCM Token",
    "name": "Save_FCM_Token",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "fcmToken",
            "description": "<p>FCM's token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/message",
    "title": "Send Message",
    "name": "Send_Message",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>reciepient user id</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>message text</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/message.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/password-recovery",
    "title": "Send password recovery email",
    "name": "Send_Password_Recovery_Email",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/user/audio",
    "title": "Upload voice message",
    "name": "Upload_voice_message",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>token should be sent. In the followng pattern Bearer {Token} replace by real token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "formData": [
          {
            "group": "formData",
            "type": "File",
            "optional": false,
            "field": "audio",
            "description": "<p>audio file</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error message. will be an array if the error is more than one, for example validation failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "success",
            "description": "<p>contains &quot;false&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/user/media.js",
    "groupTitle": "User"
  }
] });
