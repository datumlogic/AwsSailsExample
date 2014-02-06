/**
 * DBInstance
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    adapter: 'rds',
    attributes: {
        DBInstanceIdentifier: {
            type: "string",
            required: true,
            alphanumeric: true,
            minLength: 1,
            maxLength: 64
        },
        DBName: {
            type: "string",
            required: true,
            alphanumeric: true,
            minLength: 1,
            maxLength: 63
        },
        AllocatedStorage: {
            type: "integer",
            required: true,
            min: 5,
            max: 1024
        },
        DBInstanceClass: {
            type: "string",
            required: true
        },
        Engine: {
            type: "string",
            required: true
        },
        MasterUsername: {
            type: "string",
            required: true,
            minLength: 1,
            maxLength: 16
        },
        MasterUserPassword: {
            type: "string",
            minLength: 8,
            maxLength: 30
        },
        DBSecurityGroups: {
            type: "array"
        },
        VpcSecurityGroupIds: {
            type: "array"
        },
        AvailabilityZone: {
            type: "string"
        },
        BackupRetentionPeriod: {
            type: "integer",
            min: 0,
            max: 35
        },
        PreferredBackupWindow: {
            type: "string"
        },
        Port: {
            type: "integer"
        },
        EngineVersion: {
            type: "string"
        },
        LicenseModel: {
            type: "string"
        },
        Iops: {
            type: "integer",
            min: 1001
        },
        PubliclyAccessible: {
            type: "boolean"
        },
        Tags: {
            type: "array"
        },
        LatestRestorableTime: {
            type: "date"
        },
        EndPoint: {
            type: "json"
        },
        InstanceCreateTime: {
            type: "date"
        },
        DBInstanceStatus: {
            type: "string"
        }
    }
};
