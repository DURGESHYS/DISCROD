# Apps
## Google Authorization
    const ga =  new MessageEmbed()

                .setColor(`${Color}`)

                .setFooter(`STAFFS APPS`, client.user.displayAvatarURL())

    message.channel.send(ga.setThumbnail("https://cdn.discordapp.com/attachments/823572003625369631/823572074403725372/f406d1746099b6a9c58fa964b8137d66.jpg").setDescription(`**DOWNLOAD:**[CLICK HERE](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)`))
.then(m => {

						m.delete({ timeout: 5000 }).catch(() => undefined);

					});
