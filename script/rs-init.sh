#!/bin/bash

mongo <<EOF
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "10.7.7.5:27017",
            "priority": 3
        },
        {
            "_id": 2,
            "host": "10.7.7.2:27017",
            "priority": 2
        },
        {
            "_id": 3,
            "host": "10.7.7.3:27017",
            "priority": 1
        }
    ]
};
rs.initiate(config, { force: true });
rs.conf();
rsconf = rs.conf();
rsconf.members = [
        {
            "_id": 1,
            "host": "10.7.7.5:27017",
            "priority": 3
        },
        {
            "_id": 2,
            "host": "10.7.7.2:27017",
            "priority": 2
        },
        {
            "_id": 3,
            "host": "10.7.7.3:27017",
            "priority": 1
        }
    ];
rs.reconfig(rsconf, {force: true});
rs.status();
EOF