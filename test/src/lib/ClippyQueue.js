const baseDir = "../../../";

const ClippyQueue = require(baseDir + "lib/ClippyQueue.js");

const utils = require(baseDir + "lib/utils.js");

const assert = require("assert").strict;

module.exports = {
    can_boost_posteriority_manually: () => {
        const q = new ClippyQueue();
        const userId = 42;
        const boosts = [1234, 5678, 9012];
        q.add({
            userId
        });

        for (const boost of boosts) {
            q.boostPosteriority(userId, boost);
        }

        assert.strictEqual(q.userPosteriority[userId], utils.arrSum(boosts),
            "A user's posteriority can be boosted.");
    },

    can_get_users_by_posteriority: () => {
        const q = new ClippyQueue();
        const userIds = [1,2,3,4];
        const userPosteriorities = [80,70,50,60];

        for (let i = 0; i < 4; i++) {
            q.add({
                id: i,
                userId: userIds[i],
            });
            q.boostPosteriority(userIds[i], userPosteriorities[i]);
        }

        const usersInPriorityOrder = utils
            .zip(userIds, userPosteriorities) // merge lists
            .sort(([id1, pos1], [id2, pos2]) => pos1 - pos2) // sort small to big by posteriority
            .map(([id, pos]) => id); // create an array of the ids

        assert.deepStrictEqual(q.getUsersByPosteriority(), usersInPriorityOrder,
            "Users in the queue are retreived in priority order.");
    },

    can_penalise_a_user: () => {
        const q = new ClippyQueue();
        const badUserItem = {
            id: 3,
            userId: 3
        };
        const items = [{
            id: 1,
            userId: 1
        }, {
            id: 2,
            userId: 2
        }, badUserItem];
        const posteriorities = [8,6,7];

        for (let i = 0; i < items.length; i++) {
            q.add(items[i]);
            q.boostPosteriority(items[i], posteriorities[i]);
        }

        // at this moment in time, the users should be in order: 2,3,1

        q.penalise(badUserItem.userId);

        // now they should be in order: 2,1,3

        let lastItem;

        while (true) {
            let nextItem = q.next();
            if (nextItem) lastItem = nextItem;
            else break;
        }

        assert.strictEqual(badUserItem, lastItem,
            "A penalised user is last in the queue.");
    },

    can_remove_a_users_item: () => {
        const q = new ClippyQueue();
        const id = 1;
        const userId = 2;
        const item = {
            id,
            userId
        };
        q.add(item);

        // check removing something not in the queue does nothing
        assert.strictEqual(q.remove(100, 200), false,
            "The queue states when it hasn't removed the requested item.");
        assert(q.getUserBucket(userId).includes(item),
            "No items other than the one specified are removed from the queue.");

        // check removing something in the queue does something
        assert(q.remove(userId, id),
            "The queue states that is has removed the requested item.");
        assert.strictEqual(q.getUserBucket(userId).includes(item), false,
            "The item requested to be removed can no longer be found in the queue.");
    },

    can_remove_all_of_a_users_items: () => {
        const q = new ClippyQueue();
        const userId = 2;
        q.add({
            id: 1,
            userId
        });
        q.purge(userId);

        const userBucketReturn = q.getUserBucket(userId);
        assert(userBucketReturn === undefined || userBucketReturn.length === 0,
            "A purged user has no items in the queue.");
        assert.strictEqual(q.getTitlesFromUserBucket(userId).length, 0,
            "A purged user has no items in the queue.");
    },

    can_retreive_added_entries: () => {
        const q = new ClippyQueue();
        const id = 100;
        const userId = 42;
        const item = {
            id,
            userId,
        };
        q.add(item);
        const buckets = q.getBuckets();

        assert.strictEqual(q.getContent(userId, id), item,
            "An item added to a ClippyQueue should be retreivable.");
        assert(buckets.hasOwnProperty(userId),
            "A user added to a ClippyQueue should appear in the queue buckets.");
        assert(buckets[userId].includes(item),
            "An item added to a ClippyQueue should appear in the user's queue bucket.");
    },

    can_retreive_items_in_order_of_user_priority: () => {
        const q = new ClippyQueue();
        const items = [{
            id: 1,
            userId: 100
        },
        {
            id: 2,
            userId: 200
        },
        {
            id: 3,
            userId: 300
        }];
        const posteriorities = [50, 30, 70];

        const itemsInPriorityOrder = utils
            .zip(items, posteriorities) // merge lists
            .sort(([item1, pos1], [item2, pos2]) => pos1 - pos2) // sort small to big by posteriority
            .map(([item, pos]) => item); // create an array of items

        for (let i = 0; i < items.length; i++) {
            q.add(items[i]);
            q.boostPosteriority(items[i].userId, posteriorities[i]);
        }

        for (const item of itemsInPriorityOrder) {
            assert.strictEqual(item, q.next(),
                "An item is retreived in the correct order based on its user's priority.");
        }
    },
};