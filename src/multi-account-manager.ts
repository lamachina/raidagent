import { Scraper } from './scraper';
import { TwitterAccount } from './types/account';

export class MultiAccountManager {
    private scrapers: Map<string, Scraper> = new Map();

    constructor(private accounts: TwitterAccount[]) { }

    async initialize(): Promise<void> {
        for (const account of this.accounts) {
            const scraper = new Scraper();
            try {
                await scraper.login(
                    account.username,
                    account.password,
                    account.email,
                    undefined,
                    account.apiKey,
                    account.apiSecretKey,
                    account.accessToken,
                    account.accessTokenSecret
                );
                this.scrapers.set(account.username, scraper);
                console.log(`Successfully logged in as @${account.username}`);
            } catch (error) {
                console.error(`Failed to login as @${account.username}:`, error);
            }
        }
    }

    async performActions(tweetId: string): Promise<void> {
        const actions = Array.from(this.scrapers.entries()).map(async ([username, scraper]) => {
            try {
                // Like the tweet
                await scraper.likeTweet(tweetId);
                console.log(`@${username} liked tweet ${tweetId}`);

                // Retweet the tweet
                await scraper.retweet(tweetId);
                console.log(`@${username} retweeted tweet ${tweetId}`);

            } catch (error) {
                console.error(`Error performing actions for @${username}:`, error);
            }
        });

        await Promise.all(actions);
    }

    getScraper(username: string): Scraper | undefined {
        return this.scrapers.get(username);
    }

    getAllScrapers(): Scraper[] {
        return Array.from(this.scrapers.values());
    }
} 