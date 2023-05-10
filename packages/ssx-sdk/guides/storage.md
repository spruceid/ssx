# SSX Storage Module Guide

The SSX storage module is a part of the SSX framework—a toolbox for user-controlled identity, credentials, storage, and more. This guide will walk you through using the SSX storage module with examples.

## SSX Object

First, you need to import the required modules and create an SSX object:

```javascript
import { SSX } from '@spruceid/ssx';
const ssx = new SSX();
```

## User Authorization

In order to interact with the SSX Storage module, you'll need to first sign in with the user's wallet and sign out when you're done.

### Sign In

```javascript
const session = await ssx.signIn();
```

You'll now have a valid session with stored credentials for future interactions.

## Storage Operations

The SSX storage module supports basic storage operations like `get`, `put`, `list`, and `delete`. Below are the examples to use these operations.

### Get

To get the stored value associated with a specific key:

```javascript
const key = 'your_key_here';
const value = await ssx.storage.get(key);
console.log('Value:', value);
```

### Put

To store a value with a specific key:

```javascript
const key = 'your_key_here';
const value = 'your_value_here';
await ssx.storage.put(key, value);
```

### List

To list all the keys currently stored:

```javascript
const keys = await ssx.storage.list();
console.log('Stored keys:', keys);
```

### Delete

To delete the stored value associated with a specific key:

```javascript
const key = 'your_key_here';
await ssx.storage.delete(key);
```

## Sign Out

To sign out and invalidate the user's session:

```javascript
await ssx.signOut();
```

By following the steps in this guide, you can successfully use the SSX storage module for storing and managing data in a user-controlled environment.