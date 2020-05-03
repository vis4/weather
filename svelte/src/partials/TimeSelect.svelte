<script>
    import { beforeUpdate, tick } from 'svelte';
    import { timeFormat } from 'd3-time-format';
    import { timeDay, timeMonth } from 'd3-time';
    import { curDate, msg } from '../stores';

    const tfmt = timeFormat('%b %d, %Y');

    let month = $curDate.getMonth()+1;
    let day = $curDate.getDate();
    let year = $curDate.getFullYear();

    let _month = month;
    let _day = day;
    let _year = year;

    beforeUpdate(async () => {
        if (month !== _month || day !== _day || year !== _year) {
            let date = new Date(year, month-1, day);
            await tick();
            _day = day = date.getDate();
            _month = month = date.getMonth()+1;
            _year = year = date.getFullYear();
            $curDate = date;
        }
    });


</script>

<style>
    .button i.im {
        font-size: 10px;
        margin: 0 -3px;
    }
    input[type='number'] {
        max-width: 5em;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }
    input[type='number'] {
        -moz-appearance: textfield; /* Firefox */
    }
    .form-inline {
        margin-bottom: 20px;
    }
    .btn-group input[type='number'] {
        border-left: 0;
        border-right: 0;
        text-align: center;
        border-radius: 0;
    }
</style>

<div class="form-inline">
    <label>{$msg.day}</label>
    <input type="number" bind:value={day} />

    <label>{$msg.month}</label>
    <input type="number" bind:value={month} />

    <label>{$msg.year}</label>
    <input type="number" bind:value={year} />
</div>
