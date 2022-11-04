---
description: Learn how to access and configure the metrics SSX reports from your server
---

# 📊 Accessing the SSX Dashboard

## Overview

Wondering how to see usage metrics from your dapp? You can integrate your SSX-powered dapp with the SSX Dashboard! By configuring your project and connecting it with the SSX Dashboard, you can access [metrics](accessing-the-ssx-dashboard.md#viewing-metrics) such as DAUs, MAUs, Total Unique Users, logins over time, and more.

## Getting Started

First, log into the platform ([app.ssx.id](https://app.ssx.id)), and click on "New Project".

![](<.gitbook/assets/ssx dashboard - getting started 1 - 2.gif>)

Next, the platform will ask you to name your project. You can always change this name later if you wish to.&#x20;

![](<.gitbook/assets/ssx dashboard - getting started 2 - 2.gif>)

After creating the project, you will then be given an API Key for that project. Please save it in a safe place to use later, and click the **Create Dapp** button.&#x20;

To send logs to the SSX Dashboard you **must** have an API Key, and you can have only one API Key at a time. If you lose it, you will be able to [generate another one](accessing-the-ssx-dashboard.md#getting-a-new-api-key).&#x20;

{% hint style="warning" %}
This API Key will allow you to [send logs](accessing-the-ssx-dashboard.md#using-your-api-key-with-ssx-server) from your dapp to the dashboard. Be careful where you put it in your code.
{% endhint %}

![](<.gitbook/assets/ssx dashboard - getting started 3 - 2.gif>)

You will now be redirected to the dashboard view, and as soon as there is new activity on your dapp, metrics will start to appear! :tada:

![](<.gitbook/assets/ssx dashbpard - empty metrics.png>)

## Using your API Key with SSX-Server

Once you have your [API Key](accessing-the-ssx-dashboard.md#getting-a-new-api-key), you can add it to your server using `ssx-server`. This enables logs from the server to be sent to the dashboard that captures metrics on your server such as the total number of sign-ins.

Adding it to your server looks like the following:

```javascript
import { SSXServer } from "@spruceid/ssx-server";

const ssx = new SSXServer({
  providers: {
    metrics: { service: "ssx", apiKey: process.env.SSX_API_KEY },
  },
});
```

For more details on getting started with `ssx-server`, check out our quickstart guide!

{% content-ref url="ssx-quickstart.md" %}
[ssx-quickstart.md](ssx-quickstart.md)
{% endcontent-ref %}

## Viewing Metrics

You will be able to view metrics in the SSX Dashboard once you start sending logs from your dapp.&#x20;

Open the SSX Dashboard and click the **View Details** button to open the project dashboard. You will find the following:

* **Daily Active Users** **(DAUs)**: The number of unique users who have logged in in the last 24 hours.
* **Monthly Active Users (MAUs)**: The number of unique users who have logged in in the last 30 days.
* **Total Unique Users**: The total number of unique users who have logged in.
* **SSX-Logins**: an interactive chart with your project's login logs.
* **Users Over Time:** a calendar chart with your project's DAUs over time.
* **Users:** a table outlining user accounts, balances, and the date and time of their last transaction.
* **Top Contracts:** a table with the most used smart contracts by your users.

{% hint style="warning" %}
You cannot delete or update any logs that have already been sent to the platform.
{% endhint %}

![](<.gitbook/assets/ssx dashboard - viewing metrics 1 - 2.gif>)

## Getting a new API Key

When you create your project you receive an API Key, but you can always generate a new one. Each project can only have one API key at a time and you have to delete the previous one before generating a new one.&#x20;

{% hint style="danger" %}
If you delete an API Key you won't be allowed to send logs using it - you will have to change the API Key on all configuration files on your project.
{% endhint %}

If you want to generate another API key, go to the SSX Dashboard home page > click the **View Details** button to open the project > click the **Settings** button, and you will see a section titled "API Key".

![](<.gitbook/assets/ssx dashboard - getting a new api key 1 - 2.gif>)

Click on the **delete icon** inside the API Key input to delete it, then confirm your decision, and finally click the **Generate API Key** button to get a new API Key.&#x20;

![](<.gitbook/assets/ssx dashboard - getting a new api key 2 - 2.gif>)

## Updating your project settings

You can update your project name at any time by going to the SSX Dashboard home page, clicking the **View Details** button to open the project, and clicking the **Settings** button. This page will show a section titled **Basic Details** with a form to change and save a new project name.&#x20;

## Deleting your project

You can delete your project name at any time. Go to the SSX Dashboard home page, click the **View Details** button to open the project you wish to delete, click the **Settings** button, and click the **trash can** icon on the project card.

{% hint style="danger" %}
This action will delete all logs you have already sent to the platform and will not be able to send new logs to this project. **This cannot be undone.**
{% endhint %}
