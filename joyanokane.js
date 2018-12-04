function gassho() {
    let counter = 108,
        sec = 15,
        ctx = new AudioContext(),
        sampleRate = 8000,　//ctx.sampleRate,
        length = sampleRate * sec,
        buffer = ctx.createBuffer(1, length, sampleRate),
        bd = buffer.getChannelData(0);

    let [wc1, c1Lv] = [Math.PI * 2 / sampleRate * 130, 0.8],
        [wc2, c2Lv] = [wc1 * 1.0080, 1 - c1Lv],
        [wm1, m1Lv] = [wc1 * 11 / 8, 1.2],
        [wm2, m2Lv] = [wc1 * 05 / 1, 0.1],
        attack = Math.round(sampleRate * 0.01);

    for (let i = 0, decay = length - attack, envelope; i < length; i++) {
        if (i < attack) envelope = (i / attack) ** 0.5;
        else envelope = ((length - i) / decay) ** 2;

        let mod2 = Math.sin(wm2 * i) * m2Lv * envelope ** 10;
        let mod1 = Math.sin(wm1 * i + mod2) * m1Lv * envelope;
        let car1 = Math.sin(wc1 * i + mod1) * c1Lv * envelope;
        let car2 = Math.sin(wc2 * i) * c2Lv * envelope;

        bd[i] = car1 + car2;
    }

    (function loop() {
        let t = ctx.currentTime,
            bs = ctx.createBufferSource();

        bs.buffer = buffer;
        bs.connect(ctx.destination);
        bs.start(t);
        bs.stop(t + sec);

        if (--counter) setTimeout(loop, sec * 1000);
    })();
}