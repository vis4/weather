<script>
    import { timeFormat } from 'd3-time-format';
    import { timeDay, timeMonth } from 'd3-time';
    import { curDate, msg } from '../stores';

    const tfmt = timeFormat('%Y');

    $: yearStr = tfmt($curDate);

    function changeDate(prop, offset, delay = 300) {
        let d = new Date($curDate);
        d[`set${prop}`](d[`get${prop}`]() + offset);
        // move date to last of month
        // d = timeDay.offset(timeMonth.ceil(d), -1);
        // if (d >= new Date()) d = new Date();
        $curDate = d;
    }

    const prevDay = () => changeDate('Date', -1);
    const nextDay = () => changeDate('Date', +1);
    const prevMonth = () => changeDate('Month', -1);
    const nextMonth = () => changeDate('Month', +1);
    const prevYear = () => changeDate('FullYear', -1);
    const nextYear = () => changeDate('FullYear', +1);

    function handleDateChange(event) {
        if (+event.target.value > 1881 && event.target.value < 2021) {
            $curDate = new Date(event.target.value, 11, 31);
        }
    }
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
    <div class="btn-group ml-2 mr-2">
        <button class="button" on:click={prevDay}>
            <i class="im im-angle-left" />
        </button>
        <button class="button" on:click={nextDay}>
            <i class="im im-angle-right" />
        </button>
    </div>

    <label>{$msg.month}</label>
    <div class="btn-group ml-2 mr-2">
        <button class="button" on:click={prevMonth}>
            <i class="im im-angle-left" />
        </button>
        <button class="button" on:click={nextMonth}>
            <i class="im im-angle-right" />
        </button>
    </div>

    <label>{$msg.year}</label>
    <div class="btn-group ml-2 mr-2">
        <button class="button" on:click={prevYear}>
            <i class="im im-angle-left" />
        </button>
        <input
            class="form-control form-control-sm"
            type="number"
            value={$curDate.getFullYear()}
            on:input={handleDateChange}
            on:change={handleDateChange} />
        <button class="button" on:click={nextYear}>
            <i class="im im-angle-right" />
        </button>
    </div>

    <button
        class="button ml-2"
        on:mousedown={() => ($curDate = new Date())}>
        {$msg.today}
    </button>

</div>
