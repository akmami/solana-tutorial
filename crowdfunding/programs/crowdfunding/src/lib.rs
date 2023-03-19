use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("7EpjcPETt3UfaDcze1YDhr7WRPxqUdvC4MhXSeoHmZDU");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn create(_ctx: Context<Create>, _name: String, _description: String) -> ProgramResult {
        let campaign = &mut _ctx.accounts.campaign;
        campaign.name = _name;
        campaign.amount_donated = 0;
        campaign.description = _description;
        campaign.admin = *_ctx.accounts.user.key; //createer of campaign
        Ok(())
    }

    pub fn withdraw(_ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
        let campaign = &mut _ctx.accounts.campaign;
        let user = &mut _ctx.accounts.user;
        if campaign.admin != *user.key {
            return Err(ProgramError::IncorrectProgramId);
        }
        let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
        if **campaign.to_account_info().lamports.borrow() - rent_balance < amount {
            return Err(ProgramError::InsufficientFunds);
        }
        // Transfer amount from campaign to user
        **campaign.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        Ok(())
    }

    pub fn donate(_ctx: Context<Donate>, amount: u64) -> ProgramResult {
        // we cannot say send money from user to campaign account directly,
        // instead, we give authority to make them transfer to the campaign via system instructions (ix)
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &_ctx.accounts.user.key(), //sender
            &_ctx.accounts.campaign.key(),
            amount
        );
        let _ = anchor_lang::solana_program::program::invoke(
            &ix,    // instruction
            &[      // account_infos
                _ctx.accounts.user.to_account_info(),
                _ctx.accounts.campaign.to_account_info()
            ]
        );
        (&mut _ctx.accounts.campaign).amount_donated += amount;
        Ok(())
    }
}

#[derive(Accounts)] // This is context
pub struct Create<'info> {
    // if hash is already in use, bump is 8 bit space which is being added until found unique address
    #[account(init, payer=user, space=9000, seeds=[b"CAMPAIGN_DEMO".as_ref(), user.key().as_ref()], bump)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct Campaign {
    pub admin: Pubkey,
    pub amount_donated: u64, 
    pub description: String,
    pub name: String 
}
