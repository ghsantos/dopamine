import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { Desktop } from '../../common/io/desktop';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { AppearanceService } from './appearance.service';

describe('AppearanceService', () => {
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;
    let overlayContainerMock: IMock<OverlayContainer>;
    let remoteProxyMock: IMock<BaseRemoteProxy>;
    let fileSystemMock: IMock<FileSystem>;
    let desktopMock: IMock<Desktop>;

    let service: AppearanceService;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();
        overlayContainerMock = Mock.ofType<OverlayContainer>();
        remoteProxyMock = Mock.ofType<BaseRemoteProxy>();
        fileSystemMock = Mock.ofType<FileSystem>();
        desktopMock = Mock.ofType<Desktop>();

        desktopMock.setup((x) => x.accentColorChanged$).returns(() => new Observable());
        desktopMock.setup((x) => x.nativeThemeUpdated$).returns(() => new Observable());
        desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => true);

        service = new AppearanceService(
            settingsMock.object,
            loggerMock.object,
            overlayContainerMock.object,
            remoteProxyMock.object,
            fileSystemMock.object,
            desktopMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
