// Recruiting and NIL (Name, Image, Likeness) System for College Hockey

class RecruitingSystem {
    constructor() {
        this.recruitingInterests = []; // Schools interested in player
        this.officialVisits = []; // Scheduled official visits
        this.unofficialVisits = []; // Completed unofficial visits
        this.offers = []; // Scholarship offers
        this.commitment = null; // Player's commitment
        this.signingDate = null; // National signing date
    }

    // Generate recruiting interest based on player performance
    generateInterest(player, season) {
        if (player.age < 16 || player.age > 18) return;
        
        const ppg = player.points / (player.gamesPlayed || 1);
        const recruitingScore = this.calculateRecruitingScore(player, ppg);
        const starRating = this.getStarRating(recruitingScore);
        
        // Determine number of schools interested
        let numSchools = 0;
        if (starRating === 5) numSchools = Math.floor(Math.random() * 20) + 40; // 40-60 schools
        else if (starRating === 4) numSchools = Math.floor(Math.random() * 15) + 20; // 20-35 schools
        else if (starRating === 3) numSchools = Math.floor(Math.random() * 10) + 10; // 10-20 schools
        else if (starRating === 2) numSchools = Math.floor(Math.random() * 5) + 5; // 5-10 schools
        else numSchools = Math.floor(Math.random() * 3) + 2; // 2-5 schools
        
        // Generate interested schools
        const availableSchools = [...NCAA_TEAMS];
        const interestedSchools = [];
        
        for (let i = 0; i < numSchools && availableSchools.length > 0; i++) {
            const index = Math.floor(Math.random() * availableSchools.length);
            const school = availableSchools.splice(index, 1)[0];
            
            interestedSchools.push({
                school: school,
                interestLevel: Math.floor(Math.random() * 3) + (starRating * 20), // 20-100
                contactDate: new Date(),
                lastContact: new Date(),
                visitCompleted: false,
                offerExtended: false
            });
        }
        
        this.recruitingInterests = interestedSchools.sort((a, b) => b.interestLevel - a.interestLevel);
        return { starRating, interestedSchools: interestedSchools.length };
    }

    calculateRecruitingScore(player, ppg) {
        let score = 0;
        
        // Performance metrics (0-40 points)
        score += Math.min(40, ppg * 20);
        
        // Skills (0-30 points)
        const avgSkill = Object.values(player.skills).reduce((a, b) => a + b, 0) / Object.keys(player.skills).length;
        score += (avgSkill - 40) / 2; // 0-30 points for 40-100 skill range
        
        // Intangibles (0-20 points)
        score += player.reputation / 5;
        score += player.confidence / 5;
        
        // Personality bonuses (0-10 points)
        if (player.personality.id === 'leader') score += 5;
        if (player.personality.id === 'clutch') score += 5;
        if (player.personality.id === 'sniper') score += 3;
        if (player.personality.id === 'playmaker') score += 3;
        
        return Math.max(0, Math.min(100, score));
    }

    getStarRating(score) {
        if (score >= 90) return 5; // Elite prospect
        if (score >= 75) return 4; // Top prospect
        if (score >= 60) return 3; // Good prospect
        if (score >= 45) return 2; // Average prospect
        return 1; // Developmental prospect
    }

    // Schedule official visit (max 5 allowed by NCAA rules)
    scheduleOfficialVisit(schoolId, player) {
        if (this.officialVisits.length >= 5) {
            return { success: false, message: 'Maximum 5 official visits allowed' };
        }
        
        const interest = this.recruitingInterests.find(i => i.school.id === schoolId);
        if (!interest) {
            return { success: false, message: 'School not recruiting you' };
        }
        
        const visit = {
            schoolId: schoolId,
            school: interest.school,
            date: this.getNextWeekend(),
            completed: false,
            impression: 0 // Will be calculated during visit
        };
        
        this.officialVisits.push(visit);
        return { success: true, visit };
    }

    // Complete official visit and generate impression
    completeOfficialVisit(visitIndex, player) {
        const visit = this.officialVisits[visitIndex];
        if (!visit || visit.completed) return;
        
        // Calculate visit impression (0-100)
        let impression = 50; // Base
        
        // School fit factors
        const school = visit.school;
        
        // Hockey program quality
        impression += (school.hockeyRating - 80) / 2; // ±10 points
        
        // Academic fit
        if (player.academicGoals === 'high' && school.academicRating >= 90) impression += 15;
        else if (player.academicGoals === 'medium' && school.academicRating >= 75) impression += 10;
        else if (player.academicGoals === 'low') impression += 5;
        
        // Location preference
        if (player.homeState === school.state) impression += 10;
        else if (this.isNearbyState(player.homeState, school.state)) impression += 5;
        
        // Coaching staff personality match
        const coachMatch = Math.random() * 20 - 10; // ±10 random factor
        impression += coachMatch;
        
        // Facilities
        impression += Math.random() * 10; // 0-10 for facilities
        
        // Playing time projection
        const playingTimeBonus = Math.random() * 15;
        impression += playingTimeBonus;
        
        visit.impression = Math.max(0, Math.min(100, impression));
        visit.completed = true;
        
        // Update interest level
        const interest = this.recruitingInterests.find(i => i.school.id === visit.schoolId);
        if (interest) {
            interest.visitCompleted = true;
            interest.interestLevel = Math.min(100, interest.interestLevel + visit.impression / 10);
        }
        
        return visit;
    }

    // Extend scholarship offer
    receiveOffer(schoolId) {
        const interest = this.recruitingInterests.find(i => i.school.id === schoolId);
        if (!interest) return { success: false };
        
        const offer = {
            schoolId: schoolId,
            school: interest.school,
            offerDate: new Date(),
            scholarshipType: 'full', // Full scholarship for hockey
            nilPackage: this.calculateNILPackage(interest.school),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            status: 'pending'
        };
        
        this.offers.push(offer);
        interest.offerExtended = true;
        
        return { success: true, offer };
    }

    // Calculate NIL package for school
    calculateNILPackage(school) {
        const basePackage = school.nilBudget || 100000;
        const variance = Math.random() * 0.4 - 0.2; // ±20%
        const totalValue = Math.floor(basePackage * (1 + variance));
        
        return {
            totalValue: totalValue,
            breakdown: {
                collectiveFund: Math.floor(totalValue * 0.5),
                localBusiness: Math.floor(totalValue * 0.3),
                socialMedia: Math.floor(totalValue * 0.1),
                autographs: Math.floor(totalValue * 0.1)
            },
            guaranteedYears: 4
        };
    }

    // Commit to school
    commitToSchool(schoolId, player) {
        const offer = this.offers.find(o => o.schoolId === schoolId && o.status === 'pending');
        if (!offer) {
            return { success: false, message: 'No pending offer from this school' };
        }
        
        this.commitment = {
            schoolId: schoolId,
            school: offer.school,
            commitDate: new Date(),
            nilPackage: offer.nilPackage,
            startYear: player.age >= 18 ? new Date().getFullYear() + 1 : new Date().getFullYear() + (19 - player.age),
            publicAnnouncement: true
        };
        
        // Decline all other offers
        this.offers.forEach(o => {
            if (o.schoolId !== schoolId) o.status = 'declined';
        });
        offer.status = 'accepted';
        
        // Calculate signing date (early or regular signing period)
        const currentMonth = new Date().getMonth();
        if (currentMonth >= 10) { // November or later
            this.signingDate = new Date(new Date().getFullYear(), 10, 10); // Early signing: November 10
        } else {
            this.signingDate = new Date(new Date().getFullYear() + 1, 3, 15); // Regular signing: April 15
        }
        
        return { success: true, commitment: this.commitment };
    }

    // Get recruiting ranking
    getRecruitingRanking(player) {
        const score = this.calculateRecruitingScore(player, player.points / (player.gamesPlayed || 1));
        const starRating = this.getStarRating(score);
        
        // National ranking (simulated)
        let ranking;
        if (starRating === 5) ranking = Math.floor(Math.random() * 20) + 1; // Top 20
        else if (starRating === 4) ranking = Math.floor(Math.random() * 80) + 21; // 21-100
        else if (starRating === 3) ranking = Math.floor(Math.random() * 150) + 101; // 101-250
        else if (starRating === 2) ranking = Math.floor(Math.random() * 250) + 251; // 251-500
        else ranking = Math.floor(Math.random() * 500) + 501; // 501+
        
        return {
            starRating,
            nationalRanking: ranking,
            positionRanking: Math.floor(ranking / 3), // Position-specific ranking
            score
        };
    }

    isNearbyState(state1, state2) {
        const regions = {
            northeast: ['MA', 'ME', 'NH', 'VT', 'RI', 'CT', 'NY', 'NJ', 'PA'],
            midwest: ['OH', 'MI', 'IN', 'IL', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
            south: ['MD', 'VA', 'WV', 'NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'AL', 'MS', 'AR', 'LA'],
            west: ['MT', 'WY', 'CO', 'NM', 'ID', 'UT', 'AZ', 'NV', 'WA', 'OR', 'CA', 'AK', 'HI'],
            canada: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK']
        };
        
        for (let region in regions) {
            if (regions[region].includes(state1) && regions[region].includes(state2)) {
                return true;
            }
        }
        return false;
    }

    getNextWeekend() {
        const date = new Date();
        const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
        date.setDate(date.getDate() + daysUntilSaturday);
        return date;
    }
}

// NIL Deal Management System
class NILSystem {
    constructor() {
        this.activeDeals = [];
        this.completedDeals = [];
        this.totalEarnings = 0;
        this.socialMediaFollowers = {
            instagram: 1000,
            twitter: 500,
            tiktok: 2000
        };
    }

    // Generate available NIL opportunities
    generateOpportunities(player, school) {
        const opportunities = [];
        
        // Local business deals (always available)
        for (let i = 0; i < 3; i++) {
            opportunities.push(this.generateLocalBusinessDeal(player, school));
        }
        
        // National brand deals (reputation dependent)
        if (player.reputation >= 70) {
            opportunities.push(this.generateNationalBrandDeal(player));
        }
        
        // Social media deals (follower dependent)
        if (this.getTotalFollowers() >= 50000) {
            opportunities.push(this.generateSocialMediaDeal(player));
        }
        
        // Autograph session deals
        opportunities.push(this.generateAutographDeal(player, school));
        
        // Camp/clinic deals
        if (player.reputation >= 60) {
            opportunities.push(this.generateCampDeal(player));
        }
        
        return opportunities;
    }

    generateLocalBusinessDeal(player, school) {
        const businesses = ['Restaurant', 'Car Dealership', 'Sporting Goods Store', 'Local Bank', 'Real Estate Agency'];
        const business = businesses[Math.floor(Math.random() * businesses.length)];
        
        return {
            type: 'local_business',
            company: `${school.city} ${business}`,
            description: `Promotion and appearances for local ${business.toLowerCase()}`,
            value: Math.floor(Math.random() * 5000) + 2000, // $2,000-$7,000
            duration: 12, // months
            requirements: ['Social media posts (2/month)', 'Store appearances (1/quarter)', 'Photo shoot'],
            timeCommitment: '5 hours/month'
        };
    }

    generateNationalBrandDeal(player) {
        const brands = ['Nike Hockey', 'Adidas Hockey', 'Bauer', 'CCM', 'Warrior', 'True Hockey'];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        
        return {
            type: 'national_brand',
            company: brand,
            description: `Equipment endorsement and promotion for ${brand}`,
            value: Math.floor(Math.random() * 25000) + 15000, // $15,000-$40,000
            duration: 24, // months
            requirements: ['Use company equipment', 'Social media posts (4/month)', 'Photo/video content'],
            timeCommitment: '8 hours/month',
            bonuses: {
                performanceBased: true,
                playoffBonus: 5000,
                championshipBonus: 10000
            }
        };
    }

    generateSocialMediaDeal(player) {
        return {
            type: 'social_media',
            company: 'Social Media Partnership',
            description: 'Sponsored social media content creation',
            value: Math.floor(Math.random() * 8000) + 3000, // $3,000-$11,000
            duration: 6, // months
            requirements: ['Sponsored posts (4/month)', 'Story mentions', 'Engagement targets'],
            timeCommitment: '3 hours/month'
        };
    }

    generateAutographDeal(player, school) {
        return {
            type: 'autograph',
            company: `${school.name} Memorabilia`,
            description: 'Autograph signing session at school store',
            value: Math.floor(Math.random() * 2000) + 1000, // $1,000-$3,000
            duration: 1, // one-time event
            requirements: ['2-hour signing session', 'Sign minimum 200 items'],
            timeCommitment: '3 hours (including setup)'
        };
    }

    generateCampDeal(player) {
        return {
            type: 'camp',
            company: 'Youth Hockey Camp',
            description: 'Instructor at youth hockey development camp',
            value: Math.floor(Math.random() * 4000) + 2000, // $2,000-$6,000
            duration: 1, // summer camp
            requirements: ['3-day camp instruction', 'Q&A sessions', 'Photo ops with campers'],
            timeCommitment: '24 hours (3 days)'
        };
    }

    // Accept NIL deal
    acceptDeal(deal, player) {
        deal.startDate = new Date();
        deal.endDate = new Date(Date.now() + deal.duration * 30 * 24 * 60 * 60 * 1000);
        deal.status = 'active';
        deal.earningsReceived = 0;
        
        this.activeDeals.push(deal);
        
        // Immediate signing bonus (25% upfront)
        const signingBonus = Math.floor(deal.value * 0.25);
        player.bankBalance += signingBonus;
        deal.earningsReceived += signingBonus;
        this.totalEarnings += signingBonus;
        
        return {
            success: true,
            signingBonus,
            message: `Signed ${deal.company} deal! Received $${signingBonus} signing bonus.`
        };
    }

    // Process monthly NIL payments
    processMonthlyPayments(player) {
        let totalPayment = 0;
        
        this.activeDeals.forEach(deal => {
            if (deal.status === 'active') {
                const monthlyPayment = Math.floor((deal.value - deal.earningsReceived) / deal.duration);
                
                player.bankBalance += monthlyPayment;
                deal.earningsReceived += monthlyPayment;
                this.totalEarnings += monthlyPayment;
                totalPayment += monthlyPayment;
                
                // Check if deal is complete
                if (deal.earningsReceived >= deal.value) {
                    deal.status = 'completed';
                    this.completedDeals.push(deal);
                    this.activeDeals = this.activeDeals.filter(d => d !== deal);
                }
            }
        });
        
        return totalPayment;
    }

    // Update social media followers based on performance
    updateFollowers(player, event) {
        let growth = 0;
        
        if (event === 'goal') growth = Math.floor(Math.random() * 100) + 50;
        else if (event === 'hatTrick') growth = Math.floor(Math.random() * 500) + 300;
        else if (event === 'gameWinner') growth = Math.floor(Math.random() * 200) + 100;
        else if (event === 'award') growth = Math.floor(Math.random() * 1000) + 500;
        else if (event === 'championship') growth = Math.floor(Math.random() * 5000) + 2000;
        
        // Distribute growth across platforms
        this.socialMediaFollowers.instagram += Math.floor(growth * 0.5);
        this.socialMediaFollowers.twitter += Math.floor(growth * 0.3);
        this.socialMediaFollowers.tiktok += Math.floor(growth * 0.2);
        
        return growth;
    }

    getTotalFollowers() {
        return Object.values(this.socialMediaFollowers).reduce((a, b) => a + b, 0);
    }

    // Get NIL value estimate
    getMarketValue(player) {
        let value = 10000; // Base value
        
        // Performance multiplier
        const ppg = player.points / (player.gamesPlayed || 1);
        value *= (1 + ppg * 0.5);
        
        // Reputation multiplier
        value *= (player.reputation / 50);
        
        // Social media multiplier
        const followers = this.getTotalFollowers();
        if (followers >= 100000) value *= 2;
        else if (followers >= 50000) value *= 1.5;
        else if (followers >= 10000) value *= 1.2;
        
        return Math.floor(value);
    }
}
